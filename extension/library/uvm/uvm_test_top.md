**`uvm_test_top`** — the instance name `run_test()` gives to the test

Not a variable or a type, but a string: when `run_test()` creates the selected test through the factory, it names the instance `uvm_test_top`. Every component path in the testbench therefore starts with it, and it appears in every report and in configuration scopes.

**Where you see it**

```
UVM_INFO fifo_wr_driver.sv(31) @ 125: uvm_test_top.env.wr_agt.drv [FIFO_WR_DRV] driving data=0x3c
```

**Where you write it**

```systemverilog
module tb_fifo;
    fifo_if fifo_vif (.clk(clk), .rst_n(rst_n));

    initial begin
        uvm_config_db #(virtual fifo_if)::set(null, "uvm_test_top.env.wr_agt*", "vif", fifo_vif);
        run_test();
    end
endmodule
```

On the command line:

```
+uvm_set_verbosity=uvm_test_top.env.wr_agt.*,_ALL_,UVM_HIGH,time,0
+uvm_set_inst_override=fifo_wr_driver,fifo_err_driver,uvm_test_top.env.wr_agt.drv
```

**Notes**

- A scope of `"*"` in `uvm_config_db::set(null, "*", ...)` avoids spelling it out, at the cost of matching everything.
- From inside the test, use `this` as the context and a relative path (`"env.wr_agt*"`) instead; the name is then implied.
- The parent of `uvm_test_top` is `uvm_top`, whose own name is the empty string.

**See also**: `run_test`, `uvm_test`, `uvm_top`, `uvm_config_db`, `UVM_TESTNAME`
