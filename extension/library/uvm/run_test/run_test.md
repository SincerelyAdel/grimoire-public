**`run_test`** — start the UVM testbench

The global task that launches everything. Called once from an `initial` block in the top-level module, it selects the test, creates it through the factory as `uvm_test_top`, runs all phases in order, and calls `$finish` when they are done.

**Signature**

```systemverilog
task run_test(string test_name = "");
```

| Argument | Meaning |
| --- | --- |
| `test_name` | Default test to run if `+UVM_TESTNAME` is not on the command line. Usually left empty. |

**Example**

```systemverilog
module tb_fifo;
    import uvm_pkg::*;
    `include "uvm_macros.svh"
    import fifo_vip_pkg::*;
    import fifo_test_pkg::*;

    logic clk = 0;
    logic rst_n;

    always #5 clk = ~clk;

    fifo_if     fifo_vif (.clk(clk), .rst_n(rst_n));
    SIMPLE_FIFO dut (.clk(clk), .rst_n(rst_n), .wr_en(fifo_vif.wr_en) /* ... */);

    initial begin
        rst_n = 1'b0;
        repeat (4) @(posedge clk);
        rst_n = 1'b1;
    end

    initial begin
        uvm_config_db #(virtual fifo_if)::set(null, "uvm_test_top.env*", "vif", fifo_vif);
        run_test();
    end
endmodule
```

```
xrun -uvm -f fifo.f +UVM_TESTNAME=fifo_test
```

**What it does**

1. Reads `+UVM_TESTNAME`; falls back to the `test_name` argument.
2. Applies command-line factory overrides and configuration settings.
3. Creates the test with the factory and names it `uvm_test_top`.
4. Runs the phases: build, connect, end of elaboration, start of simulation, run and the run-time phases, extract, check, report, final.
5. Prints the report summary and calls `$finish`, unless `uvm_top.finish_on_completion` is 0.

**Rules**

- Put every `uvm_config_db::set` that the test needs before the call, in the same `initial` block. `run_test()` never returns before the build phase has run.
- Call it at time 0. The run phase must start at time 0; a later call fails with a `RUNPHSTIME` fatal.
- Call it exactly once.
- The packages containing the tests must be imported or otherwise referenced in the top module, or the test classes may not be elaborated and `+UVM_TESTNAME` cannot find them.

**See also**: `UVM_TESTNAME`, `uvm_test`, `uvm_test_top`, `uvm_root`, `uvm_config_db`, `uvm_phase`
