backend/
  app/
    __init__.py
    main.py              # FastAPI app + routers only
    api/
      __init__.py
      pipelines.py       # /pipelines/parse + /pipelines/execute
    core/
      __init__.py
      errors.py          # typed errors + error -> response mapping
      settings.py        # env config (later)
    engine/
      __init__.py
      models.py          # Node, Edge, PipelinePayload
      validate.py        # graph validation (dangling edges, bad handles, etc.)
      compile.py         # compile graph (adj, indeg, bindings)
      topo.py            # deterministic topo sort
      runtime.py         # ExecutionContext, run loop
      nodes/
        __init__.py
        registry.py      # NodeRegistry: type -> handler
        input.py
        text.py
        transform.py
        condition.py
        pipeline.py
        output.py
  requirements.txt
