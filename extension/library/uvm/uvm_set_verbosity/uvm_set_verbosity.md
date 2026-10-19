**`+uvm_set_verbosity`** — command-line control of reporting per component (`+uvm_set_verbosity`, `+uvm_set_action`, `+uvm_set_severity`)

Three plusargs that change report settings for chosen components and message IDs, without recompiling or editing the test. They are the command-line equivalents of `set_report_verbosity_level`, `set_report_id_action` and `set_report_severity_override`.

**Syntax**

```
+uvm_set_verbosity=<comp>,<id>,<verbosity>,<phase>
+uvm_set_verbosity=<comp>,<id>,<verbosity>,time,<time>
+uvm_set_action=<comp>,<id>,<severity>,<action>
+uvm_set_severity=<comp>,<id>,<current severity>,<new severity>
```

| Field | Meaning |
| --- | --- |
| `comp` | Full component path, with `*` and `?` wildcards |
| `id` | Message ID, or `_ALL_` for every ID |
| `verbosity` | `UVM_NONE` ... `UVM_DEBUG` |
| `phase` | Phase at whose start the setting is applied, for example `build` or `run` |
| `time,<time>` | Apply at an absolute simulation time instead |
| `severity` | `UVM_INFO`, `UVM_WARNING`, `UVM_ERROR`, `UVM_FATAL` or `_ALL_` |
| `action` | `UVM_NO_ACTION` or a `\|`-separated list such as `UVM_DISPLAY\|UVM_COUNT` |

**Examples**

```
# Full detail from the write agent only, from the start of the run phase
+uvm_set_verbosity=uvm_test_top.env.wr_agt.*,_ALL_,UVM_FULL,run

# Scoreboard detail only after 1 ms
+uvm_set_verbosity=uvm_test_top.env.scb,FIFO_SCB,UVM_HIGH,time,1000000

# Silence one message ID everywhere
+uvm_set_action=*,FIFO_WR_MON,_ALL_,UVM_NO_ACTION

# Make every warning in the environment an error
+uvm_set_severity=uvm_test_top.env.*,_ALL_,UVM_WARNING,UVM_ERROR

# Demote one known error to a warning
+uvm_set_severity=uvm_test_top.env.scb,FIFO_SCB,UVM_ERROR,UVM_WARNING
```

**Notes**

- Each option can be given several times.
- A malformed option is ignored with a warning (`INVLCMDARGS`); check the log if a setting seems to have no effect.
- Quote the argument in a shell if it contains `*` or `|`.
- Related options: `+UVM_VERBOSITY` for the global threshold, `+uvm_set_type_override` and `+uvm_set_inst_override` for the factory, `+uvm_set_config_int` and `+uvm_set_config_string` for configuration.

**See also**: `UVM_VERBOSITY`, `uvm_verbosity`, `uvm_action`, `uvm_severity`, `set_report_verbosity_level`, `uvm_set_type_override`, `uvm_set_config_int`
