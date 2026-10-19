**`do_copy`** — the hook you implement so that `copy()` and `clone()` work

`uvm_object::copy(rhs)` is not virtual; it calls the virtual `do_copy(rhs)`, which you override to copy your class's own fields from `rhs` into `this`. `clone()` creates a new object and then calls `copy()`, so it relies on the same hook.

**Signature**

```systemverilog
virtual function void do_copy(uvm_object rhs);
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;
    fifo_cfg          cfg;               // shared, copied by reference
    fifo_payload      payload;           // owned, copied deeply

    virtual function void do_copy(uvm_object rhs);
        fifo_transaction rhs_;
        super.do_copy(rhs);                        // copy base-class fields first
        if (!$cast(rhs_, rhs))
            `uvm_fatal("FIFO_TR", "do_copy: rhs is not a fifo_transaction")
        data  = rhs_.data;
        delay = rhs_.delay;
        legal = rhs_.legal;
        cfg   = rhs_.cfg;
        if (rhs_.payload != null) $cast(payload, rhs_.payload.clone());
        else                      payload = null;
    endfunction
endclass

// Usage
fifo_transaction a, b;
b = fifo_transaction::type_id::create("b");
b.copy(a);                         // b now equals a

$cast(b, a.clone());               // create + copy in one step
```

**Rules**

- Call `super.do_copy(rhs)` first, so every level of the class hierarchy copies its own fields.
- `rhs` arrives as a `uvm_object`; `$cast` it to your type before reading fields.
- Decide for each object handle whether to copy the handle (shared) or clone the object (deep copy).
- Do not override `copy()` itself.

**Notes**

- Fields registered with `` `uvm_field_* `` macros are copied automatically before `do_copy` is called; do not copy them a second time by hand.
- Monitors and scoreboards depend on this: a monitor that publishes a reused object, or a scoreboard that stores handles instead of clones, shows data that changes after the fact.
- A class with no `do_copy` and no field macros copies nothing, silently.

**See also**: `clone`, `do_compare`, `do_print`, `uvm_object`, `uvm_field_int`, `uvm_object_utils`
