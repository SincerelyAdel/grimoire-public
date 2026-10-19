**`uvm_subscriber`** — base class for a component that consumes one analysis stream

A ready-made analysis receiver. It already contains an analysis export and declares the `write()` function as pure virtual, so a derived class only has to implement `write()`. It is the usual base for functional coverage collectors.

**Declaration**

```systemverilog
virtual class uvm_subscriber #(type T = int) extends uvm_component;
    uvm_analysis_imp #(T, this_type) analysis_export;
    function new(string name, uvm_component parent);
    pure virtual function void write(T t);
```

**Notes**

- It handles exactly one stream. For two or more, use `` `uvm_analysis_imp_decl `` or analysis FIFOs in a `uvm_scoreboard` instead.
- The member is named `analysis_export`, even though its type is an imp.
- A covergroup embedded in a class must be constructed in the class constructor.
- `write()` must not block and must not modify the transaction; other subscribers receive the same object.

**See also**: `uvm_analysis_port`, `uvm_analysis_imp`, `analysis_export`, `uvm_scoreboard`, `uvm_monitor`

---

**Coding example**

```systemverilog
class fifo_coverage extends uvm_subscriber #(fifo_transaction);
    `uvm_component_utils(fifo_coverage)

    fifo_transaction tr;

    covergroup cg;
        data_cp:  coverpoint tr.data  { bins zero = {0}; bins max = {8'hFF}; bins others = default; }
        delay_cp: coverpoint tr.delay { bins b2b = {0}; bins gap[] = {[1:4]}; }
        legal_cp: coverpoint tr.legal;
    endgroup

    function new(string name = "fifo_coverage", uvm_component parent = null);
        super.new(name, parent);
        cg = new();
    endfunction

    function void write(fifo_transaction t);
        tr = t;
        cg.sample();
    endfunction
endclass

// In the environment:
wr_agt.ap.connect(cov.analysis_export);
```

---

**Visual**

<img src="behavior.svg" width="300">
