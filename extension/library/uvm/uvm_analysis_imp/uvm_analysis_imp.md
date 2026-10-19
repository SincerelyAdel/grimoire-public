**`uvm_analysis_imp`** — the receiving end of an analysis connection, which calls your `write` function

An imp ("implementation") terminates a chain of analysis connections. When a connected port is written, the imp calls `write(T t)` on the component it belongs to. That component must define the function.

**Declaration**

```systemverilog
class uvm_analysis_imp #(type T = int, type IMP = int)
    extends uvm_port_base #(uvm_tlm_if_base #(T, T));

    function new(string name, IMP imp);
    function void write(input T t);      // calls imp.write(t)
```

| Parameter | Meaning |
| --- | --- |
| `T` | Transaction type. |
| `IMP` | Type of the component that implements `write`. |

**More than one input**

A class can only have one `write`. For several inputs, declare suffixed imp types:

```systemverilog
`uvm_analysis_imp_decl(_wr)
`uvm_analysis_imp_decl(_rd)

uvm_analysis_imp_wr #(fifo_transaction, fifo_scoreboard) wr_ap;   // calls write_wr
uvm_analysis_imp_rd #(fifo_transaction, fifo_scoreboard) rd_ap;   // calls write_rd
```

**Notes**

- The second constructor argument is the implementing component, normally `this`. It serves as the parent too.
- `write` must be a function with exactly one argument of type `T`. A task, or a different argument type, fails to compile inside the imp class, with an error that points into the UVM source.
- Do not modify the received transaction; clone it first, as other subscribers hold the same handle.
- `uvm_subscriber` packages an imp and a pure virtual `write` for the single-input case.

**See also**: `uvm_analysis_imp_decl`, `uvm_analysis_port`, `uvm_analysis_export`, `uvm_subscriber`, `uvm_scoreboard`, `uvm_tlm_analysis_fifo`

---

**Coding example**

```systemverilog
class fifo_predictor extends uvm_component;
    `uvm_component_utils(fifo_predictor)

    uvm_analysis_imp  #(fifo_transaction, fifo_predictor) wr_imp;
    uvm_analysis_port #(fifo_transaction)                 expected_ap;

    function new(string name = "fifo_predictor", uvm_component parent = null);
        super.new(name, parent);
        wr_imp      = new("wr_imp", this);
        expected_ap = new("expected_ap", this);
    endfunction

    function void write(fifo_transaction t);
        fifo_transaction exp;
        if (!t.legal) return;
        $cast(exp, t.clone());
        expected_ap.write(exp);
    endfunction
endclass

// Environment
wr_agt.ap.connect(pred.wr_imp);
```

---

**Visual**

<img src="behavior.svg" width="300">
