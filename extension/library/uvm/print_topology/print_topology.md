**`print_topology`** — print the component hierarchy

A method of `uvm_root`, called on `uvm_top`. It prints every component in the testbench as a tree, with type names and, for components with printable fields, their values. It is the quickest way to confirm that the environment was built as intended.

**Signature**

```systemverilog
function void print_topology(uvm_printer printer = null);
```

**Example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    super.end_of_elaboration_phase(phase);
    uvm_top.print_topology();                              // table format
    // uvm_top.print_topology(uvm_default_tree_printer);   // tree format
endfunction
```

Output:

```
UVM_INFO @ 0: reporter [UVMTOP] UVM testbench topology:
--------------------------------------------------------------
Name                       Type                    Size  Value
--------------------------------------------------------------
uvm_test_top               fifo_test               -     @336
  env                      fifo_env                -     @349
    rd_agt                 fifo_rd_agent           -     @371
      drv                  fifo_rd_driver          -     @502
        rsp_port           uvm_analysis_port       -     @517
        seq_item_port      uvm_seq_item_pull_port  -     @509
      mon                  fifo_rd_monitor         -     @388
        ap                 uvm_analysis_port       -     @395
      sqr                  fifo_sequencer          -     @403
    scb                    fifo_scoreboard         -     @380
    wr_agt                 fifo_wr_agent           -     @362
--------------------------------------------------------------
```

**What to look for**

- A passive agent shows only its monitor.
- A factory override shows the override type in the Type column.
- A missing component means its `create()` was skipped or guarded out.
- Ports and exports appear as children, which confirms they were constructed.

**Notes**

- Call it in `end_of_elaboration_phase` or later, when the hierarchy is complete. During `build_phase` it shows only what exists so far.
- Setting `uvm_top.enable_print_topology = 1` prints it automatically at end of elaboration.
- To print a subtree, call `print()` on that component: `env.wr_agt.print();`.
- Reduce the output with a printer whose `knobs.depth` is limited.

**See also**: `uvm_root`, `uvm_top`, `end_of_elaboration_phase`, `sprint`, `uvm_printer`, `uvm_factory`
