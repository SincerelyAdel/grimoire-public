**`start_of_simulation_phase`** — the last zero-time phase before the run begins

Runs after `end_of_elaboration_phase` and immediately before `run_phase`. It is a function, takes zero time, and executes bottom-up. Use it for anything that should happen once, at time 0, just before stimulus starts.

**Signature**

```systemverilog
virtual function void start_of_simulation_phase(uvm_phase phase);
```

**Typical uses**

- Print a banner with the test name, seed and key configuration.
- Open log files and set file-based report actions.
- Install report catchers and callbacks.
- Set initial values in models and memories.

**Notes**

- It cannot consume time. Anything that waits for a clock or reset belongs in `run_phase` or `reset_phase`.
- The difference from `end_of_elaboration_phase` is one of intent: that phase finishes and checks the structure; this one prepares for execution.

**See also**: `end_of_elaboration_phase`, `run_phase`, `uvm_report_catcher`, `uvm_action`

---

**Coding example**

```systemverilog
function void start_of_simulation_phase(uvm_phase phase);
    UVM_FILE log;
    super.start_of_simulation_phase(phase);

    `uvm_info("TEST", $sformatf("test=%s seed=%0d depth=%0d",
                                 get_type_name(), $get_initial_random_seed(), env.cfg.depth), UVM_NONE)

    log = $fopen("fifo_scb.log", "w");
    env.scb.set_report_default_file(log);
    env.scb.set_report_severity_action(UVM_INFO, UVM_DISPLAY | UVM_LOG);

    demoter = new("demoter");
    uvm_report_cb::add(env.scb, demoter);
endfunction
```

---

**Visual**

<img src="behavior.svg" width="300">
