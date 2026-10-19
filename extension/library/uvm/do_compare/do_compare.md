**`do_compare`** — the hook you implement so that `compare()` works

`uvm_object::compare(rhs)` calls the virtual `do_compare(rhs, comparer)`, which you override to compare your class's fields with those of `rhs`. It returns 1 when the objects match. Scoreboards use `compare()` to check an observed transaction against an expected one.

**Signature**

```systemverilog
virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;            // timing: not part of functional equality
    bit               legal = 1'b1;

    virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
        fifo_transaction rhs_;
        if (!$cast(rhs_, rhs)) return 0;
        return super.do_compare(rhs, comparer)
            && (data  === rhs_.data)
            && (legal ==  rhs_.legal);
    endfunction
endclass

// Scoreboard
if (!act.compare(exp))
    `uvm_error("FIFO_SCB", $sformatf("mismatch\n  got:      %s\n  expected: %s",
                                      act.convert2string(), exp.convert2string()))
```

**Letting the comparer report the differences**

```systemverilog
virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
    fifo_transaction rhs_;
    if (!$cast(rhs_, rhs)) return 0;
    do_compare  = super.do_compare(rhs, comparer);
    do_compare &= comparer.compare_field_int("data",  data,  rhs_.data,  $bits(data), UVM_HEX);
    do_compare &= comparer.compare_field_int("legal", legal, rhs_.legal, 1);
endfunction
```

Each helper records a miscompare message naming the field and both values.

**Rules**

- Return 1 for equal, 0 for different.
- Include `super.do_compare(rhs, comparer)` in the result.
- Use `===` so that X and Z are compared exactly; `==` returns X when either side has unknown bits and the mismatch is missed.
- Leave out fields that are not part of functional equality: delays, timestamps, IDs.
- Do not override `compare()` itself.

**Notes**

- `compare()` on its own prints at most a `UVM_INFO` "MISCMP" message. The caller is responsible for raising the error.
- Fields registered with `` `uvm_field_* `` macros are compared automatically, unless flagged `UVM_NOCOMPARE`.

**See also**: `uvm_comparer`, `do_copy`, `do_print`, `uvm_object`, `uvm_scoreboard`, `UVM_ALL_ON`
