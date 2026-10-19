**`convert2string`** — return a one-line text description of an object

A virtual function of `uvm_object` that you override to describe the object's contents in a single string. The base version returns an empty string. It is the lightweight alternative to `sprint()`, intended for log messages.

**Signature**

```systemverilog
virtual function string convert2string();
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;

    virtual function string convert2string();
        return $sformatf("data=0x%02h delay=%0d %s", data, delay, legal ? "legal" : "ILLEGAL");
    endfunction
endclass

// In a driver, monitor or scoreboard
`uvm_info("FIFO_WR_DRV", {"driving ", req.convert2string()}, UVM_HIGH)
`uvm_error("FIFO_SCB", $sformatf("mismatch\n  got:      %s\n  expected: %s",
                                  act.convert2string(), exp.convert2string()))
```

Output:

```
UVM_INFO fifo_wr_driver.sv(31) @ 125: uvm_test_top.env.wr_agt.drv [FIFO_WR_DRV] driving data=0x3c delay=2 legal
```

**In a derived class**

```systemverilog
class fifo_tagged_transaction extends fifo_transaction;
    rand bit [3:0] tag;

    virtual function string convert2string();
        return {super.convert2string(), $sformatf(" tag=%0d", tag)};
    endfunction
endclass
```

**`convert2string` or `sprint`**

| | `convert2string` | `sprint` |
| --- | --- | --- |
| Output | One line, your format | Multi-line table or tree, from a `uvm_printer` |
| Source | Hand-written | `do_print` or the field macros |
| Cost | Cheap | Slower |
| Best for | Log messages | Full dumps while debugging |

**Notes**

- The field automation macros do not implement it. It must be written by hand.
- Wrap calls in `` `uvm_info `` with a suitable verbosity; the macro skips the string formatting entirely when the message is filtered out.
- Keep it to one line with no trailing newline, so it composes into other messages.

**See also**: `sprint`, `do_print`, `uvm_object`, `uvm_sequence_item`, `uvm_info`
