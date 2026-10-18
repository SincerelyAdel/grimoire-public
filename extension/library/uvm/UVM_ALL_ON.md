**`UVM_ALL_ON`** — flags for the field automation macros (`UVM_DEFAULT`, `UVM_NOCOMPARE`, `UVM_NOPRINT`, ...)

The second argument of every `` `uvm_field_* `` macro. The flags select which of the automated operations include the field. Combine them with `|`, and add a radix flag such as `UVM_HEX` to control printing.

**Operation flags**

| Flag | Meaning |
| --- | --- |
| `UVM_ALL_ON` | Include the field in every operation |
| `UVM_DEFAULT` | The recommended setting: everything on, with deep copy and compare for objects |
| `UVM_COPY` / `UVM_NOCOPY` | Include in or exclude from `copy()` |
| `UVM_COMPARE` / `UVM_NOCOMPARE` | Include in or exclude from `compare()` |
| `UVM_PRINT` / `UVM_NOPRINT` | Include in or exclude from `print()` and `sprint()` |
| `UVM_RECORD` / `UVM_NORECORD` | Include in or exclude from `record()` |
| `UVM_PACK` / `UVM_NOPACK` | Include in or exclude from `pack()` and `unpack()` |

**Modifier flags**

| Flag | Meaning |
| --- | --- |
| `UVM_PHYSICAL` | Mark as a physical field, for policies that filter on it |
| `UVM_ABSTRACT` | Mark as an abstract field |
| `UVM_READONLY` | Do not let configuration settings write the field |
| `UVM_DEEP` | Object field: copy and compare the object it refers to |
| `UVM_SHALLOW` | Object field: copy one level only |
| `UVM_REFERENCE` | Object field: copy and compare the handle only |

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    rand logic [7:0]  data;
    rand int unsigned delay;
    time              observed_at;
    fifo_cfg          cfg;

    `uvm_object_utils_begin(fifo_transaction)
        `uvm_field_int   (data,        UVM_DEFAULT | UVM_HEX)
        `uvm_field_int   (delay,       UVM_DEFAULT | UVM_DEC | UVM_NOCOMPARE)
        `uvm_field_int   (observed_at, UVM_DEFAULT | UVM_TIME | UVM_NOCOMPARE | UVM_NOPACK)
        `uvm_field_object(cfg,         UVM_DEFAULT | UVM_REFERENCE | UVM_NOPRINT)
    `uvm_object_utils_end
endclass
```

**Notes**

- Timing and bookkeeping fields should carry `UVM_NOCOMPARE`, or a scoreboard reports mismatches that are not functional.
- `UVM_NOPACK` keeps a field out of the bit stream sent to a serial driver.
- The `NO` flags subtract from `UVM_DEFAULT`; listing only `UVM_NOCOMPARE` without `UVM_DEFAULT` still leaves the other operations on, since off is the exception.

**See also**: `uvm_field_int`, `uvm_object_utils_begin`, `UVM_HEX`, `do_copy`, `do_compare`, `do_print`
