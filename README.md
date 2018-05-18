# Module Item Requirements
### *Package Name*: module-item-requirements
### *Child Type*: post import
### *Platform*: online default, pathway default, campus optional

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

To help standardize the module items in Canvas, this module will set the requirements of the module items, according to their type.

## How to Install

```
npm install module-item-requirements
```

## Run Requirements

Will work best if run after the modules have been renamed in action-series-modules, but may be run before.

## Options

None

## Outputs

None

## Process

1. Create an array of module item types and their associated completion requirement
2. Get the course
3. Get the course's modules
4. Filter the course's modules down to only the weekly modules
5. Loop through each weekly modules' module items
- If the module item has an assigned completion requirement in the previously mentioned array, then assign the completion requirement to the module item and update the course

## Log Categories

- Update Module Item Requirements

## Requirements

Each module item in a weekly module that is NOT of types 'ExternalTool' and 'SubHeader', should be assigned a completion requirement:

- Discussions - Requirement will be to "Contribute"
- Files - Requirement will be to "View item"
- Links - Requirement will be to "View item"
- Pages - Requirement will be to "View item"
- Assignments - Requirement will be to "Submit"
- Quizzes - Requirement will be to "Submit"