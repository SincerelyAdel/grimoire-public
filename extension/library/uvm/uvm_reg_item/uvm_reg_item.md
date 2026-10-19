**`uvm_reg_item`** — the sequence item for one register-level or memory-level operation

Describes a complete abstract access: which register, field or memory, read or write, the value, the path and the map. The register layer creates one for each `read`, `write`, `mirror` or `update` call, and turns it into one or more bus operations. It is also what a `uvm_reg_predictor` publishes on its `reg_ap`.

**Main properties**

| Property | Meaning |
| --- | --- |
| `element_kind` | `UVM_REG`, `UVM_FIELD` or `UVM_MEM` |
| `element` | Handle to the register, field or memory |
| `kind` | `UVM_READ`, `UVM_WRITE`, `UVM_BURST_READ` or `UVM_BURST_WRITE` |
| `value[]` | Data written or read |
| `offset` | Memory offset, for memories |
| `status` | Result: `UVM_IS_OK`, `UVM_NOT_OK` or `UVM_HAS_X` |
| `path` | `UVM_FRONTDOOR` or `UVM_BACKDOOR` |
| `map`, `local_map` | The map the access was requested on and the one actually used |
| `parent` | The sequence that issued the access |
| `prior` | Priority |
| `extension` | An optional user object passed through to the adapter |
| `fname`, `lineno` | Call site, for messages |

**Example: register-access coverage from the predictor**

```systemverilog
class fifo_reg_cov extends uvm_subscriber #(uvm_reg_item);
    `uvm_component_utils(fifo_reg_cov)

    string       reg_name;
    uvm_access_e kind;

    covergroup cg;
        name_cp: coverpoint reg_name { bins ctrl = {"ctrl"}; bins status = {"status"}; }
        kind_cp: coverpoint kind     { bins rd = {UVM_READ}; bins wr = {UVM_WRITE}; }
        name_x_kind: cross name_cp, kind_cp;
    endgroup

    function new(string name, uvm_component parent);
        super.new(name, parent);
        cg = new();
    endfunction

    function void write(uvm_reg_item t);
        if (t.element_kind != UVM_REG) return;
        reg_name = t.element.get_name();
        kind     = t.kind;
        cg.sample();
    endfunction
endclass

predictor.reg_ap.connect(reg_cov.analysis_export);
```

**Example: passing side information to the adapter**

```systemverilog
regmodel.ctrl.write(status, value, .parent(this), .extension(prot_info));

// In the adapter's reg2bus:
uvm_reg_item item = get_item();
if (item.extension != null) ...
```

**See also**: `uvm_reg_bus_op`, `uvm_reg_adapter`, `uvm_reg_predictor`, `uvm_reg`, `uvm_status_e`
