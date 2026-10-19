**`shutdown_phase`** — the run-time phase for letting the DUT drain

The last group of the run-time phases: `pre_shutdown_phase`, `shutdown_phase` and `post_shutdown_phase`. They are tasks that run in parallel with `run_phase`, after the main stimulus. Use them to stop generating traffic and wait until everything already inside the DUT has come out and been checked.

**Signatures**

```systemverilog
virtual task pre_shutdown_phase (uvm_phase phase);
virtual task shutdown_phase     (uvm_phase phase);
virtual task post_shutdown_phase(uvm_phase phase);
```

**Notes**

- Always bound a wait like the one above with a timeout, or a lost transaction hangs the test.
- The alternative in a `run_phase`-only testbench is a drain time on the run objection, or `phase_ready_to_end` in the scoreboard.
- After `post_shutdown_phase` and `run_phase` have both ended, the cleanup phases start with `extract_phase`.

**See also**: `main_phase`, `reset_phase`, `configure_phase`, `run_phase`, `set_drain_time`, `phase_ready_to_end`, `extract_phase`

---

**Coding example**

```systemverilog
// Test: read out whatever is left in the FIFO
task shutdown_phase(uvm_phase phase);
    fifo_drain_seq drain = fifo_drain_seq::type_id::create("drain");
    phase.raise_objection(this, "draining the FIFO");
    drain.start(env.rd_agt.sqr);
    phase.drop_objection(this, "FIFO drained");
endtask

// Scoreboard: wait until every expected item has been seen
task shutdown_phase(uvm_phase phase);
    phase.raise_objection(this, "waiting for outstanding items");
    fork
        wait (expected.size() == 0);
        begin
            #10us;
            `uvm_error("FIFO_SCB", $sformatf("%0d item(s) still outstanding at shutdown", expected.size()))
        end
    join_any
    disable fork;
    phase.drop_objection(this, "outstanding items resolved");
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
