**`uvm_comparer`** — comparison policy for `compare()`

Controls how two objects are compared and how mismatches are reported. `compare()` uses the global `uvm_default_comparer` unless you pass your own. Inside `do_compare` it also provides helper functions that compare one field and record a miscompare.

**Settings**

| Field | Default | Meaning |
| --- | --- | --- |
| `show_max` | 1 | How many miscompares to print |
| `verbosity` | `UVM_LOW` | Verbosity of the miscompare messages |
| `sev` | `UVM_INFO` | Severity of the miscompare messages |
| `physical` / `abstract` | 1 / 1 | Include fields flagged `UVM_PHYSICAL` / `UVM_ABSTRACT` |
| `check_type` | 1 | Require both objects to have the same type |
| `policy` | `UVM_DEFAULT_POLICY` | Deep, shallow or reference comparison of nested objects |
| `result` | 0 | Number of miscompares found so far |
| `miscompares` | "" | Text of the miscompares |

**Helper methods**

```systemverilog
virtual function bit compare_field    (string name, uvm_bitstream_t lhs, uvm_bitstream_t rhs,
                                       int size, uvm_radix_enum radix = UVM_NORADIX);
virtual function bit compare_field_int(string name, logic [63:0] lhs, logic [63:0] rhs,
                                       int size, uvm_radix_enum radix = UVM_NORADIX);
virtual function bit compare_string   (string name, string lhs, string rhs);
virtual function bit compare_object   (string name, uvm_object lhs, uvm_object rhs);
virtual function bit compare_field_real(string name, real lhs, real rhs);
```

**Example**

```systemverilog
virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
    fifo_transaction rhs_;
    if (!$cast(rhs_, rhs)) return 0;
    do_compare  = super.do_compare(rhs, comparer);
    do_compare &= comparer.compare_field_int("data", data, rhs_.data, $bits(data), UVM_HEX);
endfunction

// In a scoreboard: report every difference as an error
uvm_comparer cmp = new();
cmp.show_max = 10;
cmp.sev      = UVM_ERROR;
if (!observed.compare(expected, cmp))
    `uvm_error("FIFO_SCB", {"mismatch:\n", cmp.miscompares})
```

**Notes**

- With the default settings a failed `compare()` prints a single `UVM_INFO` "MISCMP" message and returns 0. The caller must still issue the error.
- The helpers return 1 on a match and record the mismatch themselves otherwise.

**See also**: `do_compare`, `uvm_object`, `uvm_printer`, `uvm_packer`
