**`uvm_event_pool`** — a name-indexed collection of `uvm_event` objects

A pool hands out events by string name, creating each one the first time it is requested. The global pool gives unrelated parts of a testbench a way to synchronise by agreeing on a name, with no handles passed between them.

**Declaration**

```systemverilog
typedef uvm_object_string_pool #(uvm_event) uvm_event_pool;     // UVM 1.1

static function uvm_event_pool get_global_pool();
static function uvm_event      get_global(string key);
virtual function uvm_event     get(string key);
virtual function int           exists(string key);
virtual function void          delete(string key);
```

**Example**

```systemverilog
// In a monitor
uvm_event overflow_ev = uvm_event_pool::get_global("fifo_overflow");
if (vif.rd_mon_cb.overflow) overflow_ev.trigger(tr);

// In a sequence
uvm_event  overflow_ev = uvm_event_pool::get_global("fifo_overflow");
uvm_object data;
overflow_ev.wait_trigger_data(data);
`uvm_info("SEQ", "overflow observed, backing off", UVM_LOW)
```

Every `uvm_transaction` also owns a private pool with the events `begin`, `end` and `accept`:

```systemverilog
uvm_event done = req.get_event_pool().get("end");
done.wait_trigger();
```

**Notes**

- Names are plain strings; a typo creates a second, unrelated event silently. Keep the names in one package as constants.
- A local pool (`uvm_event_pool pool = new("pool");`) scoped to one agent avoids clashes in a large testbench.

**See also**: `uvm_event`, `uvm_pool`, `uvm_barrier`, `uvm_transaction`
