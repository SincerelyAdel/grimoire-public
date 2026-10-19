**`uvm_resource_db`** — the lower-level resource database underneath `uvm_config_db`

A typed store of named resources, each tagged with a scope string. `uvm_config_db` is a convenience layer on top of it that builds the scope from the component hierarchy. Use the resource database directly for values that are not tied to a component path, such as global testbench settings shared with sequences or plain objects.

**Declaration**

```systemverilog
class uvm_resource_db #(type T = uvm_object);

    static function void set(input string scope, input string name,
                             T val, input uvm_object accessor = null);

    static function bit read_by_name(input string scope, input string name,
                                     inout T val, input uvm_object accessor = null);

    static function bit read_by_type(input string scope, inout T val,
                                     input uvm_object accessor = null);

    static function bit write_by_name(input string scope, input string name,
                                      input T val, input uvm_object accessor = null);

    static function rsrc_t get_by_name(string scope, string name, bit rpterr = 1);
    static function void   dump();
```

**Example**

```systemverilog
// Publish
uvm_resource_db #(int)::set("fifo_global", "max_burst", 32, this);

// Consume, from a sequence that has no component context
int max_burst;
if (!uvm_resource_db #(int)::read_by_name("fifo_global", "max_burst", max_burst, this))
    max_burst = 8;
```

**Differences from `uvm_config_db`**

| | `uvm_config_db` | `uvm_resource_db` |
| --- | --- | --- |
| Scope | Built from a component and a relative path | A free-form string or glob |
| Precedence | Higher in the hierarchy wins during build | Last write wins, unless a precedence is set |
| Typical use | Hierarchical configuration | Global or non-hierarchical data |

**Notes**

- The two share one underlying pool, so a value set with `uvm_config_db` can be read with `uvm_resource_db` if you spell out the full scope.
- Mixing them for the same value is confusing because the precedence rules differ. Pick one per value.
- `+UVM_RESOURCE_DB_TRACE` logs every access; `uvm_resource_db #(T)::dump()` prints the pool.

**See also**: `uvm_config_db`, `UVM_CONFIG_DB_TRACE`
