**`+UVM_TESTNAME`** — command-line option that selects which test to run

`run_test()` reads this plusarg, looks the name up in the factory, creates that test as `uvm_test_top` and starts the phases. It lets one compiled testbench run any registered test without recompiling.

**Syntax**

```
+UVM_TESTNAME=<test class name>
```

**Example**

```systemverilog
// tb top
initial run_test();            // no argument: the test comes from the command line

// A registered test
class fifo_test extends uvm_test;
    `uvm_component_utils(fifo_test)
    ...
endclass
```

```
xrun -uvm -f fifo.f +UVM_TESTNAME=fifo_test
xrun -R +UVM_TESTNAME=fifo_overflow_test +UVM_VERBOSITY=UVM_HIGH
```

In a Makefile:

```make
run:
	$(XRUN) -R +UVM_TESTNAME=$(TEST) +UVM_VERBOSITY=$(VERBOSITY) -svseed $(SEED)
```

**Rules**

- The plusarg overrides any name passed as `run_test("name")`. The argument is only a default.
- The name must match the string registered with the factory, which is the class name given to `` `uvm_component_utils ``.
- The test class must be compiled into the simulation. A test that is never referenced can be dropped by some flows unless its package is imported in the top module.

**Typical errors**

| Message | Cause |
| --- | --- |
| `[INVTST] Requested test from command line +UVM_TESTNAME=x not found.` | Not registered, misspelt, or not compiled |
| `[NOCOMP] No components instantiated...` | No `+UVM_TESTNAME` and no argument to `run_test()` |
| `[MULTTST] Multiple (2) +UVM_TESTNAME arguments provided on the command line.` | The option was given twice; the first is used |

**See also**: `run_test`, `uvm_test`, `uvm_test_top`, `UVM_VERBOSITY`, `uvm_cmdline_processor`
