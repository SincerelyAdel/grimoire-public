**`uvm_tlm_fifo`** — a transaction FIFO with blocking and non-blocking put and get interfaces

Stores transactions between a producer that `put`s and a consumer that `get`s, decoupling their timing. Both sides can be tasks that block: a `put` waits while the FIFO is full, a `get` waits while it is empty.

**Declaration**

```systemverilog
class uvm_tlm_fifo #(type T = int) extends uvm_tlm_fifo_base #(T);
    function new(string name, uvm_component parent = null, int size = 1);
```

| Argument | Meaning |
| --- | --- |
| `size` | Capacity. The default is 1; 0 means unbounded. |

**Exports**

| Member | Interface |
| --- | --- |
| `put_export` | `put`, `try_put`, `can_put` |
| `get_peek_export` | `get`, `try_get`, `can_get`, `peek`, `try_peek`, `can_peek` |
| `put_ap` / `get_ap` | Analysis ports that publish every item put or got |

`blocking_put_export`, `nonblocking_put_export`, `get_export`, `peek_export` and similar names are aliases of these.

**Methods**

| Method | Purpose |
| --- | --- |
| `put(input T t)` / `get(output T t)` / `peek(output T t)` | Blocking tasks |
| `try_put(input T t)` / `try_get(output T t)` / `try_peek(output T t)` | Non-blocking functions returning success |
| `can_put()` / `can_get()` / `can_peek()` | Would the operation succeed now |
| `size()` | Capacity |
| `used()` | Items currently stored |
| `is_empty()` / `is_full()` | State |
| `flush()` | Empty the FIFO |

**Notes**

- The default depth of 1 makes the producer wait for the consumer after each item. Pass 0 for an unbounded FIFO.
- For data coming from a monitor, use `uvm_tlm_analysis_fifo`, which adds a `write` function and is always unbounded.
- Sequencer-to-driver traffic uses the dedicated `seq_item_port` interface, not a TLM FIFO.

**See also**: `uvm_tlm_analysis_fifo`, `uvm_blocking_put_port`, `uvm_tlm_req_rsp_channel`, `uvm_queue`

---

**Coding example**

```systemverilog
class fifo_stim_env extends uvm_env;
    fifo_generator generator;                      // has uvm_blocking_put_port #(fifo_transaction) out
    fifo_bfm       bfm;                            // has uvm_blocking_get_port #(fifo_transaction) in
    uvm_tlm_fifo #(fifo_transaction) link;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        generator = fifo_generator::type_id::create("generator", this);
        bfm       = fifo_bfm::type_id::create("bfm", this);
        link      = new("link", this, 4);          // depth 4
    endfunction

    function void connect_phase(uvm_phase phase);
        generator.out.connect(link.put_export);
        bfm.in.connect(link.get_peek_export);
    endfunction
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
