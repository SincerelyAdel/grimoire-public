**`` `uvm_field_int ``** — field automation macros (`` `uvm_field_* ``)

Used between `` `uvm_object_utils_begin `` / `` `uvm_component_utils_begin `` and the matching `_end`. Each macro names one class property and makes the built-in `copy`, `compare`, `print`, `sprint`, `pack`, `unpack` and `record` operations handle it. On a component, the fields are also filled in from the configuration database during `super.build_phase`.

**Syntax**

```systemverilog
`uvm_field_int(ARG, FLAG)
```

| Argument | Meaning |
| --- | --- |
| `ARG` | The property name. |
| `FLAG` | Which operations to include, OR-ed with an optional radix: `UVM_DEFAULT`, `UVM_ALL_ON`, `UVM_NOCOMPARE`, `UVM_NOPRINT`, `UVM_HEX` and so on. |

**The family**

| Macro | For |
| --- | --- |
| `` `uvm_field_int(ARG, FLAG) `` | Any packed integral type: `bit`, `logic`, `int`, packed structs |
| `` `uvm_field_enum(T, ARG, FLAG) `` | An enum of type `T` |
| `` `uvm_field_string(ARG, FLAG) `` | A `string` |
| `` `uvm_field_real(ARG, FLAG) `` | A `real` |
| `` `uvm_field_object(ARG, FLAG) `` | A handle to a `uvm_object` |
| `` `uvm_field_event(ARG, FLAG) `` | An `event` |
| `` `uvm_field_sarray_int `` / `_enum` / `_object` / `_string` | Fixed-size arrays |
| `` `uvm_field_array_int `` / `_enum` / `_object` / `_string` | Dynamic arrays |
| `` `uvm_field_queue_int `` / `_enum` / `_object` / `_string` | Queues |
| `` `uvm_field_aa_<value>_<key> `` | Associative arrays, for example `` `uvm_field_aa_int_string `` |

**Example**

```systemverilog
typedef enum {WRITE, READ} fifo_op_e;

class fifo_transaction extends uvm_sequence_item;
    rand fifo_op_e    op;
    rand logic [7:0]  data;
    rand logic [7:0]  burst[];
    string            note;
    fifo_cfg          cfg;

    `uvm_object_utils_begin(fifo_transaction)
        `uvm_field_enum(fifo_op_e, op, UVM_DEFAULT)
        `uvm_field_int(data, UVM_DEFAULT | UVM_HEX)
        `uvm_field_array_int(burst, UVM_DEFAULT | UVM_HEX)
        `uvm_field_string(note, UVM_DEFAULT | UVM_NOCOMPARE)
        `uvm_field_object(cfg, UVM_DEFAULT | UVM_REFERENCE)
    `uvm_object_utils_end
endclass
```

**Notes**

- `UVM_DEFAULT` is the recommended flag; it enables every operation and, for objects, deep copy.
- `UVM_REFERENCE` on an object field copies the handle instead of cloning the object.
- The macros are convenient but slow and hard to debug. Performance-critical items usually implement `do_copy`, `do_compare` and `convert2string` instead.
- `` `uvm_field_int `` handles at most `UVM_MAX_STREAMBITS` (4096 by default) bits.

**See also**: `uvm_object_utils_begin`, `UVM_ALL_ON`, `UVM_HEX`, `do_copy`, `do_compare`, `do_print`
