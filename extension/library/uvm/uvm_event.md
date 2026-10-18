**`uvm_event`** — a class wrapper around a SystemVerilog event, with data and persistence

Like a native `event`, but it is an object, so it can be passed around, stored in a pool, shared by name, can carry a data object with each trigger, and can stay "on" so that late waiters do not miss it.

**Declaration**

```systemverilog
class uvm_event extends uvm_object;          // UVM 1.1
class uvm_event #(type T = uvm_object) extends uvm_event_base;   // UVM 1.2
    function new(string name = "");
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `trigger(T data = null)` | Fire the event, optionally with data |
| `wait_trigger()` | Wait for the next trigger; misses one that happened earlier in the same time step |
| `wait_ptrigger()` | Persistent wait; returns immediately if the event was triggered in the current time step |
| `wait_trigger_data(output T data)` / `wait_ptrigger_data(output T data)` | Wait and fetch the data |
| `wait_on(bit delta = 0)` | Wait until the event is on; returns at once if it already is |
| `wait_off(bit delta = 0)` | Wait until it is reset |
| `is_on()` / `is_off()` | Current state |
| `reset(bit wakeup = 0)` | Turn it off again |
| `get_trigger_data()`, `get_trigger_time()`, `get_num_waiters()` | Inspection |
| `add_callback(cb, bit append = 1)` / `delete_callback(cb)` | `uvm_event_callback` hooks |

**Example**

```systemverilog
// Shared by name through the global pool
uvm_event reset_done = uvm_event_pool::get_global("reset_done");

// Producer, for example a reset monitor
@(posedge vif.rst_n);
reset_done.trigger();

// Consumer, for example a sequence; works even if it starts late
reset_done.wait_on();
```

**Choosing a wait**

| Need | Use |
| --- | --- |
| React to each occurrence | `wait_trigger()` |
| Avoid a same-time-step race between trigger and wait | `wait_ptrigger()` |
| One-time condition that stays true (reset finished, configuration done) | `wait_on()` |

**See also**: `uvm_event_pool`, `uvm_barrier`, `uvm_pool`, `uvm_transaction`
