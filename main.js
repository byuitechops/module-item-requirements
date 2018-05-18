/****************************************************************************
 * Module Item Requirements
 * Description: To help standardize the module items in Canvas, this module
 * will set the requirements of the module items, according to their type.
 * 
 * Pages, Links, and Files - Requirement will be to "View item"
 * Discussions - Requirement will be to "Contribute"
 * Quizzes and Assignments - Requirement will be to "Submit"
 ****************************************************************************/
const canvas = require('canvas-api-wrapper');

module.exports = (course, stepCallback) => {
    /************************************
     * A place to act as main()
     * @param {object array} - typeRequirements: an array of module item types with their associated completion requirements 
     * @returns {} - None
     ************************************/
    async function addRequirements(typeRequirements) {
        /* Get the course, then all of the modules with their module items */
        var canvasCourse = await canvas.getCourse(course.info.canvasOU);
        await canvasCourse.modules.getAll(true); // passing getAll() 'true' retrieves each modules' module items as well

        /* Filter for weekly modules */
        var weeklyModules = canvasCourse.modules.filter(currModule => /(Week|Lesson|L|W)\s*(\d*(\D|$))/gi.test(currModule.name));

        /* For each weekly module, check if its items should have a completion_requirement or not */
        /* Must use FOR loops in order for 'await' to work properly */
        for (var i = 0; i < weeklyModules.length; i++) {
            for (var j = 0; j < weeklyModules[i].items.length; j++) {
                /* If the module item type is the same as one in the typeRequirments object array, return the match */
                var requirementObj = typeRequirements.find(typeRequirement => typeRequirement.checkType === weeklyModules[i].items[j].type);

                /* If the moduleItem type has an assigned completion requirement, then add it */
                if (requirementObj !== undefined) {
                    /* Assign the module item its completion_requirement */
                    weeklyModules[i].items[j].completion_requirement = {
                        type: requirementObj.requirement
                    };
                    /* Must update the course each time instead of all at once due to Canvas having 
                    PUT issues, and not updating each item when they are sent together */
                    await canvasCourse.update();
                    course.log(`Update Module Item Requirements`, {
                        'Title': weeklyModules[i].items[j].title,
                        'ID': weeklyModules[i].items[j].id,
                        'Requirement': weeklyModules[i].items[j].completion_requirement.type,
                    });
                }
            }
        }
    }

    /************************************
     * A place to act as main()
     * @param {} - None
     * @returns {} - None
     ************************************/
    async function runChild() {
        /* Only add the platforms your grandchild should run in */
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item isn't a valid platform type, do nothing */
        if (validPlatform !== true) {
            stepCallback(null, course);
            return;
        }

        /* An array of module item types and their associated completion requirement */
        var typeRequirements = [{
            checkType: 'ExternalUrl',
            requirement: 'must_view',
        }, {
            checkType: 'File',
            requirement: 'must_view',
        }, {
            checkType: 'Page',
            requirement: 'must_view',
        }, {
            checkType: 'Discussion',
            requirement: 'must_contribute',
        }, {
            checkType: 'Assignment',
            requirement: 'must_submit',
        }, {
            checkType: 'Quiz',
            requirement: 'must_submit',
        }];

        try {
            await addRequirements(typeRequirements);
        } catch (err) {
            course.error(err);
        } finally {
            stepCallback(null, course);
        }
    }

    /************************************
     * Start Child Module Here
     * @param {} - None
     * @returns {} - None
     ************************************/
    runChild();
};