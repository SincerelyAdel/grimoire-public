**`pre_abort`** — component callback run just before the simulation exits on a fatal error

A virtual function on `uvm_component`. When a report with the `UVM_EXIT` action is issued, normally a `` `uvm_fatal `` or the quit count being reached, the library calls `pre_abort()` on every component, bottom-up, and then finishes the simulation. The cleanup phases (`extract`, `check`, `report`, `final`) do not run in that case, so this is the only place for last-moment cleanup and diagnostics.

**Signature**

```systemverilog
virtual function void pre_abort();
```

**Example**

```systemverilog
class fifo_scoreboard extends uvm_scoreboard;
    UVM_FILE dump;

    virtual function void pre_abort();
        `uvm_info("FIFO_SCB", $sformatf("aborting with %0d expected item(s) outstanding, %0d compared",
                                         expected.size(), n_match + n_mismatch), UVM_NONE)
        foreach (expected[i])
            `uvm_info("FIFO_SCB", {"  pending: ", expected[i].convert2string()}, UVM_NONE)
        if (dump) $fclose(dump);
    endfunction
endclass

class fifo_test extends uvm_test;
    virtual function void pre_abort();
        `uvm_info("TEST", "*** TEST FAILED (aborted) ***", UVM_NONE)
    endfunction
endclass
```

**Notes**

- It is a function: no time can pass.
- Do not issue a fatal from inside it.
- Printing the verdict line here means regression scripts see a result even for aborted runs.
- It is not called when the simulation ends normally, or when it is stopped by the simulator itself, for example by `$finish` in user code or a simulator timeout.

**See also**: `uvm_fatal`, `final_phase`, `report_phase`, `uvm_action`, `UVM_MAX_QUIT_COUNT`, `uvm_root`
