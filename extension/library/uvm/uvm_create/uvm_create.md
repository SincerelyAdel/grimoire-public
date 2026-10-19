**`` `uvm_create ``** — create an item or sequence through the factory, without sending it

The first half of `` `uvm_do ``. It constructs the object with the factory and attaches it to the current sequence and sequencer, but does not randomize or send it. Pair it with `` `uvm_send `` or `` `uvm_rand_send ``.

**Syntax**

```systemverilog
`uvm_create(SEQ_OR_ITEM)
`uvm_create_on(SEQ_OR_ITEM, SEQR)
```

**Example**

```systemverilog
task body();
    `uvm_create(req)
    req.data  = 8'hA5;      // directed values, no randomization
    req.delay = 0;
    `uvm_send(req)

    `uvm_create(req)
    req.delay_c.constraint_mode(0);
    `uvm_rand_send_with(req, { delay == 10; })
endtask
```

**Notes**

- Use this split form when you need to set fields by hand, disable a constraint, or change `rand_mode` before sending.
- `` `uvm_create_on `` sets a different sequencer, for use from a virtual sequence.
- The equivalent explicit code is `req = fifo_transaction::type_id::create("req");` followed by `start_item(req)` / `finish_item(req)`.

**See also**: `uvm_do`, `uvm_send`, `uvm_rand_send`, `start_item`, `finish_item`
