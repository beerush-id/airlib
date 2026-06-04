#!/bin/bash

# Form packages (dependency order: form first, then adapters)
bpkg publish -f ui/form
bpkg publish -f ui/react-form
bpkg publish -f ui/solid-form
