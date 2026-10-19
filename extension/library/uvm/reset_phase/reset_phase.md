**`reset_phase`** — the run-time phase in which reset is applied

The first group of the twelve run-time phases, which execute in parallel with `run_phase`. `pre_reset_phase`, `reset_phase` and `post_reset_phase` are tasks. They exist so that reset generation, configuration, main traffic and shutdown can be separated and so that a test can jump back to reset in the middle of a run.

**Signatures**

```systemverilog
virtual task pre_reset_phase (uvm_phase phase);
virtual task reset_phase     (uvm_phase phase);
virtual task post_reset_phase(uvm_phase phase);
```

| Phase | Intended use |
| --- | --- |
| `pre_reset_phase` | Wait for power and clocks to be stable; signals not yet driven |
| `reset_phase` | Assert reset, drive interfaces to their idle or reset values, deassert reset |
| `post_reset_phase` | Wait for the DUT to be ready after reset, for example link training |

**Reset in the middle of a test**

```systemverilog
task main_phase(uvm_phase phase);
    phase.raise_objection(this);
    fork
        seq.start(env.wr_agt.sqr);
        begin
            #5us;
            phase.jump(uvm_reset_phase::get());    // back to reset_phase
        end
    join_any
    phase.drop_objection(this);
endtask
```

**Notes**

- Each of these phases ends when its objections are dropped. A phase in which nobody raises an objection takes zero time.
- A jump kills the tasks of the phase being left. Components must tolerate that and clean up in the next `reset_phase`.
- Many testbenches do not use the run-time phases at all: they apply reset from the testbench module and do everything else in `run_phase`.

**See also**: `configure_phase`, `main_phase`, `shutdown_phase`, `run_phase`, `uvm_phase`, `uvm_domain`

---

**Coding example**

```systemverilog
// Test or reset agent
task reset_phase(uvm_phase phase);
    phase.raise_objection(this, "applying reset");
    vif.rst_n <= 1'b0;
    repeat (5) @(posedge vif.clk);
    vif.rst_n <= 1'b1;
    phase.drop_objection(this, "reset released");
endtask

// Driver: put the interface in a known state
task reset_phase(uvm_phase phase);
    vif.wr_drv_cb.wr_en   <= 1'b0;
    vif.wr_drv_cb.data_in <= '0;
endtask

// Scoreboard: forget everything on every reset, including a phase jump
task reset_phase(uvm_phase phase);
    expected.delete();
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
