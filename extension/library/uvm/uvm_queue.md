**`uvm_queue`** — a SystemVerilog queue wrapped in a class

A parameterized object holding a `T queue[$]`. As an object it is passed by handle, so several components can share one queue, and it can be stored in the configuration database or fetched globally.

**Declaration**

```systemverilog
class uvm_queue #(type T = int) extends uvm_object;
    function new(string name = "");

    static function this_type get_global_queue();
    static function T         get_global(int index);

    virtual function T    get(int index);
    virtual function int  size();
    virtual function void insert(int index, T item);
    virtual function void delete(int index = -1);     // -1 deletes everything
    virtual function T    pop_front();
    virtual function T    pop_back();
    virtual function void push_front(T item);
    virtual function void push_back(T item);
```

**Example**

```systemverilog
typedef uvm_queue #(fifo_transaction) fifo_tr_queue;

// Shared between a predictor and a checker through the configuration database
fifo_tr_queue expected = new("expected");
uvm_config_db #(fifo_tr_queue)::set(this, "env.*", "expected", expected);

// Producer
expected.push_back(tr);

// Consumer
if (expected.size() == 0) `uvm_error("FIFO_SCB", "nothing expected")
else                      exp = expected.pop_front();
```

**Notes**

- There is no blocking `get`. For a queue that a task can wait on, use `uvm_tlm_fifo` or `uvm_tlm_analysis_fifo`.
- `get()` with an out-of-range index issues a warning and returns the default value of `T`.

**See also**: `uvm_pool`, `uvm_tlm_fifo`, `uvm_tlm_analysis_fifo`
