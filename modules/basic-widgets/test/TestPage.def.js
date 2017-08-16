$oop.postpone(window, 'TestPage', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Page,
        self = base.extend(cn);

    /**
     * @name window.TestPage.create
     * @function
     * @returns {window.TestPage}
     */

    /**
     * Lists various widgets implemented in giant-basic-widgets.
     * @class
     * @extends $basicWidgets.Page
     */
    window.TestPage = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addPrivateMethods(/** @lends window.TestPage# */{
            //@formatter:off
/** @private */
_addPlainText: function () {
    return $basicWidgets.Text.create()
        .setContentString("<em>Feline</em>");
},

/** @private */
_addEntityBoundText: function () {
    // setting initial field value
    'cat/tiger/name'.toField()
        .setValue("<em>Tiger</em>");

    return $basicWidgets.DataText.create('cat/tiger/name'.toFieldKey());
},

/** @private */
_addLocaleBoundText: function () {
    // initializing translations
    'locale/ja'.toDocument()
        .setTranslation("cat", ["ネコ"]);

    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('en'.toLocale())
        .markLocaleAsReady('ja'.toLocale());

    // setting current locale to 'ja'
    'ja'.toLocale().setAsCurrentLocale();

    return $basicWidgets.LocaleText.create()
        .setContentString("cat".toTranslatable());
},

/** @private */
_addTemplateText: function () {
    // initializing translations
    'locale/ja'.toDocument().setTranslation(
            "The cat's name is {{catName}}",
            ["猫の名前は「{{catName}}」であります"]);

    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('en'.toLocale())
        .markLocaleAsReady('ja'.toLocale());

    // setting current locale to 'ja'
    'ja'.toLocale().setAsCurrentLocale();

    // setting cat name as entity
    'cat/fluffy/name'.toField().setValue("Fluffy");

    return $basicWidgets.TemplateText.create()
        .setContentString(
            "The cat's name is {{catName}}".toTranslatable()
                .toLiveTemplate()
                .setParameterValues({
                    '{{catName}}': 'cat/fluffy/name'.toField()
                }));
},

/** @private */
_addHyperlink: function () {
    return $basicWidgets.Hyperlink.create()
        .setTargetUrl('https://http.cat')
        .addChild($basicWidgets.Text.create()
            .setContentString("HTTP Cats"));
},

/** @private */
_addDataHyperlink: function () {
    // setting entity values
    'link/1'.toDocument().setNode({
        title: 'HTTP Animals',
        url: 'https://http.cat'
    });

    return $basicWidgets.DataHyperlink.create('link/1/url'.toFieldKey())
        .addChild($basicWidgets.DataText.create('link/1/title'.toFieldKey()));
},

/** @private */
_addClickArea: function () {
    return $basicWidgets.ClickArea.create();
},

/** @private */
_addButton: function () {
    return $basicWidgets.Button.create()
        .setName('cat-says')
        .addChild($basicWidgets.Text.create()
            .setContentString("Meow"));
},

/** @private */
_addImage: function () {
    return $basicWidgets.Image.create()
        .setImageUrl('http://placekitten.com/g/512/256');
},

/** @private */
_addDataImage: function () {
    // setting entity values
    'photo/1/url'.toField().setValue('http://placekitten.com/g/512/384');

    return $basicWidgets.DataImage.create('photo/1/url'.toFieldKey());
},

/** @private */
_addList: function () {
    return $basicWidgets.List.create()
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-01')
            .setContentString("January"))
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-02')
            .setContentString("February"))
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-99')
            .setContentString("and so on..."));
},

/** @private */
_addEntityList: function () {
    // constructing EntityListPartial class
    var EntityListPartial = $basicWidgets.List.extend('EntityListPartial')
        .addTraitAndExtend($entity.EntityBound)
        .addTraitAndExtend($basicWidgets.EntityListPartial)
        .addMethods({
            init: function (fieldKey) {
                $basicWidgets.List.init.call(this);
                $entity.EntityBound.init.call(this);
                $basicWidgets.EntityListPartial.init.call(this, fieldKey);
            },
            afterAdd: function () {
                $basicWidgets.List.afterAdd.call(this);
                $basicWidgets.EntityListPartial.afterAdd.call(this);
            },
            afterRemove: function () {
                $basicWidgets.List.afterRemove.call(this);
                $basicWidgets.EntityListPartial.afterRemove.call(this);
            },
            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataText.create(itemKey)
                    .setTagName('li');
            },
            spawnItemName: function (itemKey) {
                return itemKey.itemId;
            }
        });

    // adding field configuration
    $entity.config.appendNode('document>field'.toPath(), {
        'week/days': { fieldType : 'collection' }
    });

    // setting collection contents
    'week/1'.toDocument().setNode({
        days: {
            '1': 'Monday',
            '2': 'Tuesday',
            '3': 'Wednesday',
            '4': 'Thursday',
            '5': 'Friday'
        }
    });

    return EntityListPartial.create('week/1/days'.toFieldKey());
},

/** @private */
_addTextInput: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Name")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('text')
        .setName('name')
        .setValue("Fluffy")
        .setValidator(function (value) {
            return !value || value.length <= 6;
        })
        .linkLabelWidget(label);
},

/** @private */
_addDataTextInput: function (itemWidget) {
    // setting input properties
    'input/1'.toDocument().setNode({
        name: 'lives',
        value: '9'
    });

    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Lives")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.DataTextInput.create(
        'text', 'input/1/value'.toFieldKey(), 'input/1/name'.toFieldKey())
        .linkLabelWidget(label);
},

/** @private */
_addTextArea: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Description")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('textarea')
        .setName('description')
        .setValue("Fluffy Meowington's cat toys")
        .setValidator(function (value) {
            return value && value.length >= 3;
        })
        .linkLabelWidget(label);
},

/** @private */
_addEmail: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Email")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('email')
        .setName('email')
        .setValue("fluffy@cats.com")
        .setValidator(function (value, inputWidget) {
            var element = inputWidget.getElement();
            return !element || element.checkValidity();
        })
        .linkLabelWidget(label);
},

/** @private */
_addCheckboxInput: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('z-label')
        .setContentString("Meows")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.BinaryInput.create('checkbox')
        .setName('meows')
        .setValue('Yes')
        .linkLabelWidget(label);
},

/** @private */
_addDataCheckboxInput: function (itemWidget) {
    // setting input properties
    'input/2'.toDocument().setNode({
        name: 'abilities',
        value: 'jumps'
    });

    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('z-label')
        .setContentString("Jumps")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.DataBinaryInput.create(
        'checkbox',
        'input/2/value'.toFieldKey(),
        'input/2/name'.toFieldKey())
        .linkLabelWidget(label);
},

/** @private */
_addSingleSelect: function (itemWidget) {
    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.SingleSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday")
        .addOption('day-02', 'tue', "Tuesday")
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label)
        .setValue('tue');
},

/** @private */
_addLocaleSingleSelect: function (itemWidget) {
    // initializing translations
    'locale/ja'.toDocument()
        .setTranslation("Monday", ["Montag"])
        .setTranslation("Tuesday", ["Dienstag"])
        .setTranslation("Wednesday", ["Mittwoch"])
        .setTranslation("Thursday", ["Donnerstag"])
        .setTranslation("Friday", ["Freitag"])
        .setTranslation("Saturday", ["Samstag"])
        .setTranslation("Sunday", ["Sonntag"]);

    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('ja'.toLocale());

    // setting current locale to 'ja'
    'ja'.toLocale().setAsCurrentLocale();

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.SingleSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addLocaleOption('day-01', 'mon', "Monday".toTranslatable())
        .addLocaleOption('day-02', 'tue', "Tuesday".toTranslatable())
        .addLocaleOption('day-03', 'wed', "Wednesday".toTranslatable())
        .addLocaleOption('day-04', 'thu', "Thursday".toTranslatable())
        .addLocaleOption('day-05', 'fri', "Friday".toTranslatable())
        .addLocaleOption('day-06', 'sat', "Saturday".toTranslatable())
        .addLocaleOption('day-07', 'sun', "Sunday".toTranslatable())
        .linkLabelWidget(label);
},

/** @private */
_addMultiSelect: function (itemWidget) {
    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.MultiSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday", true)
        .addOption('day-02', 'tue', "Tuesday", true)
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label);
},

/** @private */
_addDataSingleSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'single-select/options': {
            fieldType: 'collection'
        },
        'single-select/selected': {
            fieldType: 'string'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'single-select/1'.toDocument().setNode({
        options: {
            0: 'Monday',
            1: 'Tuesday',
            2: 'Wednesday',
            3: 'Thursday',
            4: 'Friday',
            5: 'Saturday',
            6: 'Sunday'
        },
        selected: '2'
    });

    return $basicWidgets.DataSingleSelect.create(
            'single-select/1/selected'.toFieldKey(),
            undefined,
            'single-select/1/options'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .linkLabelWidget(label);
},

/** @private */
_addHybridSingleSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'single-select/selected': {
            fieldType: 'string'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'single-select/2'.toDocument().setNode({
        selected: 'thu'
    });

    return $basicWidgets.DataSingleSelect.create(
            'single-select/2/selected'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday")
        .addOption('day-02', 'tue', "Tuesday")
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label);
},

/** @private */
_addDataMultiSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'multi-select/options': {
            fieldType: 'collection'
        },
        'multi-select/selected': {
            fieldType: 'collection'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'multi-select/1'.toDocument().setNode({
        options: {
            0: 'Monday',
            1: 'Tuesday',
            2: 'Wednesday',
            3: 'Thursday',
            4: 'Friday',
            5: 'Saturday',
            6: 'Sunday'
        },
        selected: {
            0: '0',
            2: '2'
        }
    });

    return $basicWidgets.DataMultiSelect.create(
            'multi-select/1/selected'.toFieldKey(),
            undefined,
            'multi-select/1/options'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .linkLabelWidget(label);
},

/** @private */
_addHybridMultiSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'multi-select/selected': {
            fieldType: 'collection'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'multi-select/2'.toDocument().setNode({
        selected: {
            'sat': 'sat',
            'sun': 'sun'
        }
    });

    return $basicWidgets.DataMultiSelect.create(
            'multi-select/2/selected'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday")
        .addOption('day-02', 'tue', "Tuesday")
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label);
},
            //@formatter:on

            /**
             * @param {function} widgetSpawner
             * @param {string|$utils.Stringifiable} hintString
             * @param {string|$utils.Stringifiable} noteString
             * @private
             */
            _addWidget: function (widgetSpawner, hintString, noteString) {
                this.getChild('widget-list')
                    .addTestItem(widgetSpawner, hintString, noteString);
            }
        })
        .addMethods(/** @lends window.TestPage# */{
            /**
             * TODO: Add data editors for databound widgets.
             * TODO: Add value editors for plain widgets.
             * TODO: Add switches to binary states.
             * @ignore
             */
            init: function () {
                base.init.call(this);

                this.elevateMethods(
                    'onClickableClick',
                    'onInputFocus',
                    'onInputBlur',
                    'onInputValidityChange',
                    'onInputValueChange',
                    'onSelectableValueChange',
                    'onSelectableStateChange',
                    'onSelectSelectionChange');

                TestList.create()
                    .setChildName('widget-list')
                    .addToParent(this);

                this._addWidget(
                    this._addPlainText,
                    "widgetId.toWidget().setHtmlEscaped(false)");

                this._addWidget(
                    this._addEntityBoundText,
                    "entityKey.toField().setValue('Jane')");

                this._addWidget(
                    this._addLocaleBoundText,
                    "'en'.toLocale().setAsCurrentLocale()");

                this._addWidget(
                    this._addTemplateText,
                    "'cat/fluffy/name'.toField().setValue('Smudge')");

                this._addWidget(
                    this._addHyperlink,
                    "widgetId.toWidget().setTargetUrl('http://http.cat/200')");

                this._addWidget(
                    this._addDataHyperlink,
                    "entityKey.toField().setValue('http://httpstatusdogs.com/')");

                this._addWidget(
                    this._addClickArea,
                    "widgetId.toWidget().disableBy('foo')");

                this._addWidget(
                    this._addButton,
                    "widgetId.toWidget().disableBy('foo')");

                this._addWidget(
                    this._addImage,
                    "widgetId.toWidget().setImageUrl('http://placekitten.com/g/512/320')");

                this._addWidget(
                    this._addDataImage,
                    "entityKey.toField().setValue('http://placekitten.com/g/512/320')");

                this._addWidget(
                    this._addList,
                    "widgetId.toWidget().getChild('month-02').removeFromParent()");

                this._addWidget(
                    this._addTextInput,
                    "widgetId.toWidget().setValue('foo')");

                this._addWidget(
                    this._addDataTextInput,
                    "'input/1/value'.toField().setValue('Hello World!')");

                this._addWidget(
                    this._addTextArea,
                    "widgetId.toWidget().setValue('foo')",
                    "Text Area");

                this._addWidget(
                    this._addCheckboxInput,
                    "widgetId.toWidget().select(true)");

                this._addWidget(
                    this._addDataCheckboxInput,
                    "widgetId.toWidget().select(true)");

                this._addWidget(
                    this._addSingleSelect,
                    "widgetId.toWidget().getItemWidgetByValue('wed').select()");

                this._addWidget(
                    this._addLocaleSingleSelect,
                    "'en'.toLocale().setAsCurrentLocale()",
                    "Locale");

                this._addWidget(
                    this._addMultiSelect,
                    "widgetId.toWidget().getItemWidgetByValue('wed').select()");

                this._addWidget(
                    this._addDataSingleSelect,
                    "'single-select/1/selected'.toField().setValue(1)");

                this._addWidget(
                    this._addHybridSingleSelect,
                    "'single-select/2/selected'.toField().setValue(1)",
                    "Hybrid");

                this._addWidget(
                    this._addDataMultiSelect,
                    "");

                this._addWidget(
                    this._addHybridMultiSelect,
                    "",
                    "Hybrid");
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo($basicWidgets.EVENT_CLICKABLE_CLICK, this.onClickableClick)
                    .subscribeTo($basicWidgets.EVENT_INPUT_FOCUS, this.onInputFocus)
                    .subscribeTo($basicWidgets.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, this.onInputValueChange)
                    .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, this.onInputValidityChange)
                    .subscribeTo($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, this.onSelectableValueChange)
                    .subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, this.onSelectableStateChange)
                    .subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectSelectionChange)
                    .subscribeTo($basicWidgets.EVENT_HOTKEY_DOWN, this.onHotkeyDown);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var containerElement = document.getElementById('app');
                if (containerElement) {
                    containerElement.appendChild(this.getElement());
                }
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onClickableClick: function (event) {
                console.info("widget clicked", event.sender.instanceId);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onInputFocus: function (event) {
                console.info("input focused", event.sender.instanceId);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onInputBlur: function (event) {
                console.info("input blurred", event.sender.instanceId);
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onInputValueChange: function (event) {
                console.info(
                    "input value changed", event.sender.instanceId,
                    "from", event.beforeValue,
                    "to", event.afterValue);
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onInputValidityChange: function (event) {
                console.info(
                    "input validity changed", event.sender.instanceId,
                    "from", !event.sender.isValid,
                    "to", event.sender.isValid);
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                console.info(
                    "selectable value changed", event.sender.instanceId,
                    "from", event.beforeValue,
                    "to", event.afterValue);
            },

            /**
             * @param {$basicWidgets.SelectableStateChangeEvent} event
             * @ignore
             */
            onSelectableStateChange: function (event) {
                console.info(
                    "selectable state changed", event.sender.instanceId,
                    "from", event.wasSelected,
                    "to", event.isSelected,
                    "value from", event.wasSelected ? event.sender.getValue() : undefined,
                    "to", event.isSelected ? event.sender.getValue() : undefined);
            },

            /**
             * @param {$basicWidgets.SelectSelectionChangeEvent} event
             * @ignore
             */
            onSelectSelectionChange: function (event) {
                var beforeValues = event.beforeValues,
                    afterValues = event.afterValues;

                console.info(
                    "select selection changed", event.sender.instanceId,
                    "from", beforeValues.getValues(),
                    "to", afterValues.getValues());
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onHotkeyDown: function (event) {
                var keyboardEvent = event.originalEvent;
                console.info("hotkey pressed", keyboardEvent.key || keyboardEvent.which);
            }
        });
});

$oop.amendPostponed($routing, 'Route', function () {
    "use strict";

    [].toRoute()
        .subscribeTo($routing.EVENT_ROUTE_CHANGE, function () {
            // activating TestPage on any route change
            TestPage.create().setAsActivePage();
        });
});
