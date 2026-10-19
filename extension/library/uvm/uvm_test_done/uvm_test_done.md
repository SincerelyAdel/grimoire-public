**`uvm_test_done`** — legacy global objection for ending the run phase

A singleton objection inherited from OVM. Before phase objections existed, a test raised and dropped this one object to control when simulation ended. It still works in UVM 1.1 for the `run` phase, is deprecated in UVM 1.2, and is removed from IEEE 1800.2.

**Old style**

```systemverilog
task run_phase(uvm_phase phase);
    uvm_test_done.raise_objection(this);
    seq.start(env.wr_agt.sqr);
    uvm_test_done.set_drain_time(this, 100ns);
    uvm_test_done.drop_objection(this);
endtask
```

**Current style**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    seq.start(env.wr_agt.sqr);
    phase.phase_done.set_drain_time(this, 100ns);   // phase.get_objection() in UVM 1.2
    phase.drop_objection(this);
endtask
```

**Notes**

- It only governs the `run` phase, never the run-time phases such as `main_phase`.
- The related `global_stop_request()` and `uvm_test_done.stop_request()` calls are also deprecated; they end the run phase regardless of work in progress.
- When porting old code, replace every use with the phase argument's objection.

**See also**: `uvm_objection`, `raise_objection`, `drop_objection`, `global_stop_request`, `uvm_phase`
