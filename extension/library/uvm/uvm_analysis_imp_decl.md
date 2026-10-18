**`` `uvm_analysis_imp_decl ``** — create an extra analysis imp type with its own `write` method

A component can only have one function called `write()`, so with the plain `uvm_analysis_imp` it can only receive from one analysis port. This macro declares a new imp class named `uvm_analysis_imp<SFX>` that calls `write<SFX>()` instead, letting one component, typically a scoreboard, receive several independent streams.

**Syntax**

```systemverilog
`uvm_analysis_imp_decl(SFX)
```

| Argument | Meaning |
| --- | --- |
| `SFX` | A suffix, conventionally starting with an underscore. It is appended to both the class name and the method name. |

It must be used at package or compilation-unit scope, outside any class.

**Example**

```systemverilog
`uvm_analysis_imp_decl(_wr)
`uvm_analysis_imp_decl(_rd)

class fifo_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(fifo_scoreboard)

    uvm_analysis_imp_wr #(fifo_transaction, fifo_scoreboard) wr_ap;
    uvm_analysis_imp_rd #(fifo_transaction, fifo_scoreboard) rd_ap;

    fifo_transaction expected[$];

    function new(string name = "fifo_scoreboard", uvm_component parent = null);
        super.new(name, parent);
        wr_ap = new("wr_ap", this);
        rd_ap = new("rd_ap", this);
    endfunction

    function void write_wr(fifo_transaction tr);
        expected.push_back(tr);
    endfunction

    function void write_rd(fifo_transaction tr);
        fifo_transaction exp = expected.pop_front();
        if (tr.data !== exp.data)
            `uvm_error("FIFO_SCB", $sformatf("got 0x%0h, expected 0x%0h", tr.data, exp.data))
    endfunction
endclass

// In the environment:
wr_agt.ap.connect(scb.wr_ap);
rd_agt.ap.connect(scb.rd_ap);
```

**Notes**

- The generated class takes the same two parameters as `uvm_analysis_imp`: the transaction type and the type of the component that implements `write<SFX>`.
- A missing `write<SFX>` method is a compile error pointing into the macro expansion.
- Each `write<SFX>` is a function and must not block. If the checker needs to wait, use a `uvm_tlm_analysis_fifo` per stream and a task in `run_phase` instead.
- The other TLM interfaces have the same kind of macro: `` `uvm_blocking_put_imp_decl ``, `` `uvm_nonblocking_get_imp_decl ``, `` `uvm_put_imp_decl ``, `` `uvm_get_peek_imp_decl `` and so on.

**See also**: `uvm_analysis_imp`, `uvm_analysis_port`, `uvm_tlm_analysis_fifo`, `uvm_scoreboard`, `uvm_subscriber`
