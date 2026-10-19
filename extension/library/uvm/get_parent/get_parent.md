**`get_parent`** — the component one level up in the hierarchy

A virtual function of `uvm_component` that returns the handle of the parent passed to the component's constructor. For the test it returns `uvm_top`; for `uvm_top` it returns null.

**Signature**

```systemverilog
virtual function uvm_component get_parent();
```

**Example**

```systemverilog
// A monitor finding out which agent it belongs to
function void build_phase(uvm_phase phase);
    uvm_agent agt;
    super.build_phase(phase);
    if ($cast(agt, get_parent()))
        `uvm_info("FIFO_MON", {"part of agent ", agt.get_full_name(),
                               agt.get_is_active() == UVM_ACTIVE ? " (active)" : " (passive)"}, UVM_HIGH)
endfunction

// Walking up to the root
function void print_ancestry();
    uvm_component c = this;
    while (c != null) begin
        `uvm_info("PATH", $sformatf("%s (%s)", c.get_full_name(), c.get_type_name()), UVM_LOW)
        c = c.get_parent();
    end
endfunction
```

**Related methods**

| Method | Returns |
| --- | --- |
| `get_parent()` | The parent component |
| `get_children(ref uvm_component children[$])` | All direct children |
| `get_child(string name)` | One child by name |
| `get_num_children()` | The number of children |
| `get_depth()` | Levels below `uvm_top`; the test is 1 |
| `lookup(string name)` | A component by path relative to this one |

**Notes**

- The return type is `uvm_component`; `$cast` it to the real parent class to use that class's members.
- Depending on the parent's type reduces reuse. Where possible, have the parent pass down what the child needs through the configuration database.
- Sequences and transactions are not components. Their equivalents are `get_parent_sequence()` and `get_sequencer()`.

**See also**: `get_full_name`, `get_name`, `uvm_component`, `uvm_root`, `print_topology`
