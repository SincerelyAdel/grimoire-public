**`+UVM_NO_RELNOTES`** — command-line option that hides the UVM release-notes banner

At time 0 the library prints its copyright header and, in UVM 1.1 and later 1.x releases, a block of notes about deprecated features and changed behaviour. This plusarg suppresses the notes block and keeps the log short. It has no effect on simulation behaviour.

**Syntax**

```
+UVM_NO_RELNOTES
```

**Example**

```make
run:
	$(XRUN) -R +UVM_TESTNAME=$(TEST) +UVM_VERBOSITY=$(VERBOSITY) +UVM_NO_RELNOTES
```

Without the option, the start of the log contains a block headed:

```
  ***********       IMPORTANT RELEASE NOTES         ************
  ...
      (Specify +UVM_NO_RELNOTES to turn off this notice)
```

**Notes**

- The block is only printed when there is something to say, for example when the library was compiled with deprecated features enabled.
- The copyright header itself is still printed.
- The notes are worth reading once: they say which deprecated features your compiled library still accepts.

**See also**: `UVM_TESTNAME`, `UVM_VERBOSITY`, `uvm_pkg`
