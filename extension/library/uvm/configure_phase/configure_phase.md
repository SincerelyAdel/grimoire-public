**`configure_phase`** — the run-time phase in which the DUT is programmed

The second group of the run-time phases, after reset and before main traffic. `pre_configure_phase`, `configure_phase` and `post_configure_phase` are tasks that run in parallel with `run_phase`. This is where the testbench writes configuration registers and loads memories so that the DUT is ready for the main stimulus.

**Signatures**

```systemverilog
virtual task pre_configure_phase (uvm_phase phase);
virtual task configure_phase     (uvm_phase phase);
virtual task post_configure_phase(uvm_phase phase);
```

| Phase | Intended use |
| --- | --- |
| `pre_configure_phase` | Decide the configuration to apply; wait for anything it depends on |
| `configure_phase` | Program registers and memories |
| `post_configure_phase` | Wait for the configuration to take effect: PLL lock, calibration, enable bits |

**Notes**

- Raise an objection for the duration of the programming, or the phase ends immediately and `main_phase` starts while registers are still being written.
- When a test jumps back to `reset_phase`, this phase runs again, which re-applies the configuration automatically. That is the main benefit of using it over a block of code at the start of `run_phase`.

**See also**: `reset_phase`, `main_phase`, `shutdown_phase`, `uvm_reg_block`, `uvm_reg_sequence`, `uvm_phase`

---

**Coding example**

```systemverilog
task configure_phase(uvm_phase phase);
    fifo_init_seq init_seq = fifo_init_seq::type_id::create("init_seq");
    uvm_status_e  status;

    phase.raise_objection(this, "programming the DUT");

    init_seq.model = env.regmodel;
    init_seq.start(null);

    // or directly through the register model
    env.regmodel.ctrl.almost_full_level.set(8'd12);
    env.regmodel.ctrl.enable.set(1'b1);
    env.regmodel.update(status);

    phase.drop_objection(this, "DUT programmed");
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
