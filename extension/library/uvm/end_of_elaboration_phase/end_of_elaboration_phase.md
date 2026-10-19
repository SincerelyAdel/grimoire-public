**`end_of_elaboration_phase`** — the phase for final checks and adjustments once the testbench is fully built and connected

Runs after `connect_phase` and after the library has resolved all TLM connections. It is a function, takes zero time, and executes bottom-up. The hierarchy is complete and will not change, so this is the place to inspect it, print it, and apply settings that need every component to exist.

**Signature**

```systemverilog
virtual function void end_of_elaboration_phase(uvm_phase phase);
```

**Typical uses**

- Print the topology and the factory state.
- Apply hierarchical report settings, which only reach components that already exist.
- Check that the configuration is consistent.
- Check connection counts on ports.

**Notes**

- Do not create components or make connections here; both are too late and are reported as errors.
- Connection errors detected by the library ("connection count of 0 does not meet required minimum of 1") appear just before this phase.
- Setting `uvm_top.enable_print_topology = 1` prints the topology automatically at this point.

**See also**: `connect_phase`, `start_of_simulation_phase`, `print_topology`, `uvm_factory`, `set_report_verbosity_level`

---

**Coding example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    super.end_of_elaboration_phase(phase);

    uvm_top.print_topology();
    uvm_factory::get().print();

    env.set_report_verbosity_level_hier(UVM_MEDIUM);
    env.wr_agt.drv.set_report_verbosity_level(UVM_HIGH);
    env.set_report_id_action_hier("FIFO_WR_MON", UVM_NO_ACTION);

    if (env.wr_agt.mon.ap.size() == 0)
        `uvm_warning("TEST", "write monitor has no subscribers")

    if (env.cfg.depth == 0)
        `uvm_fatal("TEST", "fifo depth of 0 is not supported")
endfunction
```

---

**Visual**

<img src="behavior.svg" width="300">
