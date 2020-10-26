type RuleSet = Record<string, Record<string, number | string>>;

function namespace(id: string, style: Record<string, any>): RuleSet {
    const ruleSet: RuleSet = {};

    (function pushRules(nestedId: string, nestedStyle: Record<string, any>) {
        Object.entries(nestedStyle).forEach(([property, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                if (!ruleSet[nestedId]) ruleSet[nestedId] = {};
                ruleSet[nestedId][property] = value;
                return;
            }

            let newRuleKey = property;

            if (property.includes('&')) {
                newRuleKey = property.replace(new RegExp(/&/, 'g'), nestedId);
            } else if (property.includes(':')) {
                newRuleKey = property.replace(
                    new RegExp(/:/, 'g'),
                    nestedId + ':',
                );
            } else {
                newRuleKey = property.replace(
                    new RegExp(/,/, 'g'),
                    ', ' + nestedId,
                );
                newRuleKey = nestedId + ' ' + newRuleKey;
            }

            pushRules(`${newRuleKey}`, value);
        });
    })(id, style);

    return ruleSet;
}

export default namespace;
