**`uvm_pool`** — an associative array wrapped in a class

A parameterized object holding a `T pool[KEY]` array. Because it is an object, it is passed by handle, can be put in the configuration database, and can be shared globally, none of which a bare associative array supports conveniently.

**Declaration**

```systemverilog
class uvm_pool #(type KEY = int, T = uvm_void) extends uvm_object;
    function new(string name = "");

    static function this_type get_global_pool();
    static function T         get_global(KEY key);

    virtual function T    get(KEY key);          // creates a default entry if missing
    virtual function void add(KEY key, T item);
    virtual function int  num();
    virtual function int  exists(KEY key);
    virtual function void delete(KEY key);
    virtual function int  first(ref KEY key);
    virtual function int  last (ref KEY key);
    virtual function int  next (ref KEY key);
    virtual function int  prev (ref KEY key);
```

**Example**

```systemverilog
typedef uvm_pool #(int unsigned, fifo_transaction) fifo_tr_pool;

class fifo_scoreboard extends uvm_scoreboard;
    fifo_tr_pool pending = new("pending");

    function void write_wr(fifo_transaction tr);
        pending.add(tr.get_transaction_id(), tr);
    endfunction

    function void check_phase(uvm_phase phase);
        int unsigned id;
        if (pending.first(id))
            do `uvm_error("FIFO_SCB", $sformatf("item %0d never completed", id))
            while (pending.next(id));
    endfunction
endclass
```

**Related classes**

| Class | What it is |
| --- | --- |
| `uvm_object_string_pool #(T)` | A pool keyed by string that creates missing entries by name |
| `uvm_event_pool` | String pool of `uvm_event` |
| `uvm_barrier_pool` | String pool of `uvm_barrier` |
| `uvm_queue #(T)` | The same idea for a queue |

**See also**: `uvm_queue`, `uvm_event_pool`, `uvm_object`
