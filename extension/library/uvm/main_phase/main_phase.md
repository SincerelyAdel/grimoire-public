**`main_phase`** — the run-time phase for the primary stimulus

The third group of the run-time phases: `pre_main_phase`, `main_phase` and `post_main_phase`. They are tasks that run in parallel with `run_phase`, after reset and configuration. The main test stimulus is generated here.

**Signatures**

```systemverilog
virtual task pre_main_phase (uvm_phase phase);
virtual task main_phase     (uvm_phase phase);
virtual task post_main_phase(uvm_phase phase);
```

**Example: explicit sequence**

```systemverilog
task main_phase(uvm_phase phase);
    fifo_wr_seq wr_seq = fifo_wr_seq::type_id::create("wr_seq");
    fifo_rd_seq rd_seq = fifo_rd_seq::type_id::create("rd_seq");

    phase.raise_objection(this, "main stimulus");
    fork
        wr_seq.start(env.wr_agt.sqr);
        rd_seq.start(env.rd_agt.sqr);
    join
    phase.drop_objection(this, "main stimulus done");
endtask
```

**Example: default sequence**

A sequence can be started automatically on a sequencer when a phase begins:

```systemverilog
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    uvm_config_db #(uvm_object_wrapper)::set(this, "env.wr_agt.sqr.main_phase",
                                             "default_sequence", fifo_wr_seq::type_id::get());
endfunction

// The sequence must then hold the objection itself:
task body();
    if (starting_phase != null) starting_phase.raise_objection(this);
    repeat (n_items) `uvm_do(req)
    if (starting_phase != null) starting_phase.drop_objection(this);
endtask
```

**Notes**

- The phase ends when all its objections are dropped. Without one it takes zero time and the stimulus never runs.
- Drivers and monitors normally stay in `run_phase`; only the stimulus is split across the run-time phases.
- If one component uses `main_phase` and another `run_phase` for stimulus, the end of the test depends on both sets of objections. Choose one style per testbench.
- UVM 1.2 replaces the `starting_phase` variable with `get_starting_phase()` and adds `set_automatic_phase_objection(1)`, which raises and drops the objection for you.

**See also**: `run_phase`, `reset_phase`, `configure_phase`, `shutdown_phase`, `raise_objection`, `starting_phase`, `uvm_sequencer`
