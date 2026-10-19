**`uvm_reg_field`** — register-layer model of one bit field inside a register

Holds the width, position, access policy and reset value of a field, plus its desired and mirrored values. Fields are what give the model its knowledge of side effects such as read-to-clear or write-one-to-clear, so the mirror stays correct after each access.

**Declaration**

```systemverilog
class uvm_reg_field extends uvm_object;
    function new(string name = "uvm_reg_field");

    function void configure(uvm_reg        parent,
                            int unsigned   size,
                            int unsigned   lsb_pos,
                            string         access,
                            bit            volatile,
                            uvm_reg_data_t reset,
                            bit            has_reset,
                            bit            is_rand,
                            bit            individually_accessible);
```

| Argument | Meaning |
| --- | --- |
| `size`, `lsb_pos` | Width in bits and position of the least significant bit |
| `access` | Access policy string, see below |
| `volatile` | 1 if the DUT can change the value by itself, so the mirror cannot be trusted |
| `reset`, `has_reset` | Reset value, and whether the field is reset at all |
| `is_rand` | Allow the field to be randomized |
| `individually_accessible` | The field can be written alone, through byte enables |

**Access policies**

| Policy | Effect of write | Effect of read |
| --- | --- | --- |
| `RW` | Stores the value | None |
| `RO` | None | None |
| `WO` | Stores the value | Read is an error |
| `RC` | None | Clears all bits |
| `RS` | None | Sets all bits |
| `W1C` / `W1S` / `W1T` | Writing 1 clears / sets / toggles the bit | None |
| `W0C` / `W0S` / `W0T` | Writing 0 clears / sets / toggles the bit | None |
| `WC` / `WS` | Any write clears / sets all bits | None |
| `WRC` / `WRS` | Stores the value | Clears / sets all bits |
| `W1` / `WO1` | First write after reset stores; later writes ignored | None / error |

The full list also includes `WSRC`, `WCRS`, `W1SRC`, `W1CRS`, `W0SRC` and `W0CRS`.

**Main methods**

| Method | Purpose |
| --- | --- |
| `set(value)` / `get()` | Desired value |
| `get_mirrored_value()` | Mirrored value |
| `write` / `read` / `mirror` / `predict` / `poke` / `peek` | As on `uvm_reg`, for this field |
| `get_access(map = null)`, `set_access(mode)` | Read or change the policy |
| `get_lsb_pos()`, `get_n_bits()`, `get_reset(kind = "HARD")` | Layout |
| `set_compare(UVM_NO_CHECK)` | Exclude the field from mirror checks |

**Example**

```systemverilog
// Status register with a write-one-to-clear interrupt flag
overflow_irq = uvm_reg_field::type_id::create("overflow_irq");
overflow_irq.configure(this, 1, 0, "W1C", 1, 1'b0, 1, 0, 0);

// In a test
regmodel.status.overflow_irq.write(status, 1'b1, .parent(this));   // clear it
if (regmodel.status.overflow_irq.get_mirrored_value() != 0)
    `uvm_error("REG", "overflow_irq not cleared in the model")
```

**See also**: `uvm_reg`, `uvm_reg_block`, `uvm_reg_map`, `uvm_reg_predictor`
