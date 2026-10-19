**`uvm_blocking_put_port`** — the TLM-1 port, export and imp families (`uvm_*_port`, `uvm_*_export`, `uvm_*_imp`)

TLM-1 connects components through small standard interfaces instead of direct handles. Each interface comes as three classes: a **port** on the initiator, an **export** that passes the connection through a hierarchy boundary, and an **imp** on the target, which calls methods on the component that owns it.

**Naming**

`uvm_[blocking_|nonblocking_]<interface>_<port|export|imp>`. Without a prefix, the class offers both the blocking and the non-blocking methods.

| Interface | Blocking task | Non-blocking functions | Direction of data |
| --- | --- | --- | --- |
| `put` | `put(input T t)` | `try_put(input T t)`, `can_put()` | Initiator to target |
| `get` | `get(output T t)` | `try_get(output T t)`, `can_get()` | Target to initiator, consuming |
| `peek` | `peek(output T t)` | `try_peek(output T t)`, `can_peek()` | Target to initiator, not consuming |
| `get_peek` | `get` and `peek` | `try_get`, `try_peek`, `can_get`, `can_peek` | Both of the above |
| `transport` | `transport(input REQ req, output RSP rsp)` | `nb_transport(input REQ req, output RSP rsp)` | Request and response in one call |
| `master` / `slave` | `put` request, `get`/`peek` response (and the reverse for slave) | The `try_` and `can_` forms | Bidirectional channel |
| `analysis` | none | `write(input T t)` | Broadcast to many |

**Declarations**

```systemverilog
class uvm_blocking_put_port   #(type T = int);
class uvm_blocking_put_export #(type T = int);
class uvm_blocking_put_imp    #(type T = int, type IMP = int);
// ... and likewise for every interface above
function new(string name, uvm_component parent, int min_size = 1, int max_size = 1);   // port, export
function new(string name, IMP imp);                                                    // imp
```

**Connection rules**

- Call `connect` on the initiator: `port.connect(export_or_imp)`.
- Port to port goes up the hierarchy, export to export or imp goes down.
- Every port must be connected to at least `min_size` targets by the end of elaboration, default 1. Only analysis ports default to 0.
- Several imps of the same kind in one component need the `` `uvm_<interface>_imp_decl(SFX) `` macros to create distinctly named methods.

**See also**: `uvm_tlm_fifo`, `uvm_analysis_port`, `uvm_analysis_imp_decl`, `uvm_port_base`, `uvm_seq_item_pull_port`, `uvm_tlm_req_rsp_channel`

---

**Coding example**

```systemverilog
class fifo_generator extends uvm_component;
    `uvm_component_utils(fifo_generator)
    uvm_blocking_put_port #(fifo_transaction) out;

    function new(string name, uvm_component parent);
        super.new(name, parent);
        out = new("out", this);
    endfunction

    task run_phase(uvm_phase phase);
        fifo_transaction tr;
        repeat (16) begin
            tr = fifo_transaction::type_id::create("tr");
            void'(tr.randomize());
            out.put(tr);                    // blocks until the target accepts it
        end
    endtask
endclass

class fifo_consumer extends uvm_component;
    `uvm_component_utils(fifo_consumer)
    uvm_blocking_put_imp #(fifo_transaction, fifo_consumer) in;

    function new(string name, uvm_component parent);
        super.new(name, parent);
        in = new("in", this);
    endfunction

    task put(fifo_transaction t);           // called through the imp
        #10ns;
        `uvm_info("CONS", t.convert2string(), UVM_MEDIUM)
    endtask
endclass

// Parent
generator.out.connect(consumer.in);
```

---

**Visual**

<img src="behavior.svg" width="300">
