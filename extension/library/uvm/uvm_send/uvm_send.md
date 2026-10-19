**`` `uvm_send ``** — send an already created item or sequence, without randomizing it

The second half of `` `uvm_do ``. It takes an object that already exists, normally from `` `uvm_create ``, and sends it: for an item it calls `start_item()` and `finish_item()`, for a sequence it calls `start()` on the current sequencer.

**Syntax**

```systemverilog
`uvm_send(SEQ_OR_ITEM)
`uvm_send_pri(SEQ_OR_ITEM, PRIORITY)
```

**Notes**

- Nothing is randomized. Every field keeps the value you assigned, which makes this the macro for fully directed stimulus.
- Use `` `uvm_rand_send `` if you want randomization to happen after the sequencer grant.
- `` `uvm_send_pri `` passes a priority used by the sequencer's arbitration.

**See also**: `uvm_create`, `uvm_rand_send`, `uvm_do`, `start_item`, `finish_item`

---

**Coding example**

```systemverilog
task body();
    `uvm_create(req)
    req.data  = 8'hFF;
    req.delay = 0;
    `uvm_send(req)
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
