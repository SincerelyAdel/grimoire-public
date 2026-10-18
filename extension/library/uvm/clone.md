**`clone`** — create a new object that is a copy of this one

A virtual function of `uvm_object`. It creates a new object of the same type with `create()`, copies this object into it with `copy()`, and returns it. Use it whenever a transaction must be kept or modified independently of the original.

**Signature**

```systemverilog
virtual function uvm_object clone();
```

It returns the base type, so the result must be cast.

**Example**

```systemverilog
// Monitor: publish an independent copy
fifo_transaction tr_copy;
if (!$cast(tr_copy, tr.clone()))
    `uvm_fatal("FIFO_MON", "clone failed")
ap.write(tr_copy);

// Scoreboard: keep our own copy of what we were given
function void write_wr(fifo_transaction tr);
    fifo_transaction kept;
    $cast(kept, tr.clone());
    expected.push_back(kept);
endfunction

// Driver: build a response from the request
$cast(rsp, req.clone());
rsp.set_id_info(req);
```

**What it needs from your class**

| Requirement | Provided by |
| --- | --- |
| `create()` returning the right type | `` `uvm_object_utils `` |
| Field-by-field copying | `do_copy`, or the `` `uvm_field_* `` macros |

Without the first, `clone()` returns null and reports "The create method failed". Without the second, the clone has default values in every field you declared.

**Notes**

- The clone has the same instance name as the original. Rename it with `set_name()` if that matters.
- Sequence and transaction IDs are not carried over by `copy()`; use `set_id_info()` for responses.
- Whether nested objects are duplicated or shared is decided by your `do_copy`.
- Components cannot be cloned; calling `clone()` on one is an error.

**See also**: `do_copy`, `uvm_object`, `uvm_object_utils`, `set_id_info`, `uvm_monitor`
