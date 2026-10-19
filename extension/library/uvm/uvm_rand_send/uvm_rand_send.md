**`` `uvm_rand_send ``** — randomize and send an already created item or sequence

Like `` `uvm_send ``, but it randomizes the object first. Used after `` `uvm_create `` when something must be adjusted between construction and randomization, such as turning a constraint off or fixing one field with `rand_mode(0)`.

**Syntax and family**

```systemverilog
`uvm_rand_send(SEQ_OR_ITEM)
`uvm_rand_send_with(SEQ_OR_ITEM, CONSTRAINTS)
`uvm_rand_send_pri(SEQ_OR_ITEM, PRIORITY)
`uvm_rand_send_pri_with(SEQ_OR_ITEM, PRIORITY, CONSTRAINTS)
```

**Notes**

- For an item, randomization happens after `start_item()` returns, so it sees the latest state.
- A failed randomization produces a `RNDFLD` warning, not an error. Check your constraints if items look unrandomized.

**See also**: `uvm_create`, `uvm_send`, `uvm_do`

---

**Coding example**

```systemverilog
task body();
    `uvm_create(req)
    req.data.rand_mode(0);
    req.data = 8'h00;               // keep data fixed
    `uvm_rand_send_with(req, { delay > 2; })
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
