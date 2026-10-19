**`uvm_component`** — base class for everything that lives in the testbench hierarchy

Components are the static structure of a testbench: test, environment, agents, drivers, monitors, scoreboards. Unlike plain objects they have a parent, a place in a hierarchy with a full path name, phases that the library calls in order, their own reporting settings and a view of the configuration database.

**Declaration**

```systemverilog
virtual class uvm_component extends uvm_report_object;
    function new(string name, uvm_component parent);
```

| Argument | Meaning |
| --- | --- |
| `name` | Instance name, unique among the children of `parent`. |
| `parent` | The enclosing component. `null` makes it a child of `uvm_top`. |

**Hierarchy**

| Method | Purpose |
| --- | --- |
| `get_parent()` | Parent handle |
| `get_full_name()` | Dotted path, for example `uvm_test_top.env.wr_agt.drv` |
| `get_children(ref uvm_component children[$])`, `get_child(name)`, `get_num_children()` | Walk children |
| `get_first_child(ref string name)` / `get_next_child(ref string name)` | Iterate children |
| `has_child(name)`, `lookup(name)` | Find by name or relative path |
| `get_depth()` | Depth below `uvm_top` |
| `print_topology()` (on `uvm_top`) | Print the whole tree |

**Phases**

| Phase method | Kind | Typical content |
| --- | --- | --- |
| `build_phase` | function, top-down | Get configuration, create children |
| `connect_phase` | function, bottom-up | Connect TLM ports |
| `end_of_elaboration_phase` | function | Final checks, print topology |
| `start_of_simulation_phase` | function | Banners, initial settings |
| `run_phase` | task | The time-consuming behaviour |
| `extract_phase`, `check_phase`, `report_phase`, `final_phase` | function | Collect, check and print results |

The twelve run-time phases (`reset_phase`, `configure_phase`, `main_phase`, `shutdown_phase` and their `pre_`/`post_` forms) run in parallel with `run_phase`.

**Factory and configuration helpers**

| Method | Purpose |
| --- | --- |
| `create_component(type_name, name)` / `create_object(type_name, name)` | Create by type name |
| `set_type_override_by_type`, `set_inst_override_by_type`, `set_type_override`, `set_inst_override` | Factory overrides scoped to this component |
| `print_override_info(type_name, name)` | Explain which override applies |
| `check_config_usage()`, `print_config(recurse, audit)` | Debug the configuration database |
| `set_report_verbosity_level_hier(int)` and the other `set_report_*_hier` methods | Reporting control for a subtree |

**Example**

```systemverilog
class fifo_env extends uvm_env;
    `uvm_component_utils(fifo_env)

    fifo_wr_agent   wr_agt;
    fifo_rd_agent   rd_agt;
    fifo_scoreboard scb;

    function new(string name = "fifo_env", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        wr_agt = fifo_wr_agent::type_id::create("wr_agt", this);
        rd_agt = fifo_rd_agent::type_id::create("rd_agt", this);
        scb    = fifo_scoreboard::type_id::create("scb", this);
    endfunction

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        wr_agt.ap.connect(scb.wr_ap);
        rd_agt.ap.connect(scb.rd_ap);
    endfunction
endclass
```

**Notes**

- Components can only be created before the end of `build_phase`. Creating one later is a fatal error.
- Always pass `this` as the parent of a child, and use the same string for the instance name as the variable name so paths match the code.
- Extend the specific subclass (`uvm_driver`, `uvm_monitor`, `uvm_env`, ...) instead of `uvm_component` directly; the intent is clearer and tools recognise the role.
- Call `super.build_phase(phase)` if you rely on field automation; the other `super.<phase>` calls are empty in the base class but harmless.

**See also**: `uvm_component_utils`, `uvm_object`, `uvm_phase`, `build_phase`, `run_phase`, `uvm_config_db`, `uvm_root`, `type_id`
