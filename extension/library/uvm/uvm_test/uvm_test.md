**`uvm_test`** — base class for a test case, the top of the component hierarchy

A test builds the environment, configures it and chooses the stimulus. Exactly one test runs per simulation: `run_test()` creates it through the factory and names the instance `uvm_test_top`.

**Declaration**

```systemverilog
virtual class uvm_test extends uvm_component;
    function new(string name, uvm_component parent);
```

It adds nothing to `uvm_component`; the class exists to mark the role.

**Example**

```systemverilog
class fifo_test extends uvm_test;
    `uvm_component_utils(fifo_test)

    fifo_env env;

    function new(string name = "fifo_test", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        uvm_config_db #(uvm_bitstream_t)::set(this, "env.rd_agt", "is_active", UVM_PASSIVE);
        env = fifo_env::type_id::create("env", this);
    endfunction

    function void end_of_elaboration_phase(uvm_phase phase);
        uvm_top.print_topology();
    endfunction

    task run_phase(uvm_phase phase);
        fifo_wr_seq wr_seq = fifo_wr_seq::type_id::create("wr_seq");
        fifo_rd_seq rd_seq = fifo_rd_seq::type_id::create("rd_seq");
        phase.raise_objection(this);
        fork
            wr_seq.start(env.wr_agt.sqr);
            rd_seq.start(env.rd_agt.sqr);
        join
        phase.phase_done.set_drain_time(this, 20);
        phase.drop_objection(this);
    endtask
endclass
```

Select it at run time:

```
xrun -uvm ... +UVM_TESTNAME=fifo_test
```

**Common pattern**

Put the environment, default configuration and helper tasks in a `base_test`, and derive each real test from it. A derived test then only overrides configuration, applies factory overrides, or starts a different sequence.

```systemverilog
class fifo_overflow_test extends fifo_test;
    `uvm_component_utils(fifo_overflow_test)
    function new(string name = "fifo_overflow_test", uvm_component parent = null);
        super.new(name, parent);
    endfunction
    function void build_phase(uvm_phase phase);
        fifo_transaction::type_id::set_type_override(fifo_no_delay_transaction::get_type());
        super.build_phase(phase);
    endfunction
endclass
```

**Notes**

- The test must be registered with `` `uvm_component_utils `` or `+UVM_TESTNAME` cannot find it.
- Set configuration and overrides before creating the environment, so they are in place when the children build.
- Without a raised objection the run phase ends at time 0.

**See also**: `run_test`, `uvm_test_top`, `UVM_TESTNAME`, `uvm_env`, `raise_objection`, `uvm_config_db`
