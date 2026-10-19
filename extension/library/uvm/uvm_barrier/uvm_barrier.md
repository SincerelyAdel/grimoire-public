**`uvm_barrier`** — block processes until a set number of them are waiting

A synchronisation object: each process calls `wait_for()` and is held until the number of waiters reaches a threshold, at which point all of them are released together. Useful for lining up several stimulus streams before a combined scenario.

**Declaration**

```systemverilog
class uvm_barrier extends uvm_object;
    function new(string name = "", int threshold = 0);

    virtual task          wait_for();
    virtual function void reset(bit wakeup = 1);
    virtual function void set_auto_reset(bit value = 1);
    virtual function void set_threshold(int threshold);
    virtual function int  get_threshold();
    virtual function int  get_num_waiters();
    virtual function void cancel();
```

**Example**

```systemverilog
uvm_barrier ready = new("ready", 2);

fork
    begin
        fill_seq.start(env.wr_agt.sqr);     // fill the FIFO
        ready.wait_for();                   // wait for the other stream
        burst_wr_seq.start(env.wr_agt.sqr);
    end
    begin
        idle_seq.start(env.rd_agt.sqr);
        ready.wait_for();                   // second waiter releases both
        burst_rd_seq.start(env.rd_agt.sqr);
    end
join
```

**Notes**

- With auto-reset on (the default), the barrier re-arms after releasing, so the next group of waiters is held again.
- `set_threshold()` to a value at or below the current number of waiters releases them at once.
- `uvm_barrier_pool` provides name-indexed barriers in the same way as `uvm_event_pool`.

**See also**: `uvm_event`, `uvm_event_pool`, `uvm_pool`
