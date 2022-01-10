import {compatibleCore} from "../misc.js";
import * as torgchecks from "../../../../systems/torgeternity/module/torgchecks.js";

export class torgeternity{
    constructor(){
        
    }

    //returns wound levels
    getHP(token) {
        const wounds = token.actor.data.data.wounds;
        return {
            value: wounds.value,
            max: wounds.max
        }
    }

    //returns shock levels
    getTempHP(token) {
        const shock = token.actor.data.data.shock;
        return {
            value: shock.value,
            max: shock.max
        }
    }

    //returns Toughness Value
    getAC(token) {
        return token.actor.data.data.other.toughness;
    }

    //returns Armor Value
    getShieldHP(token) {
        return token.actor.data.data.other.armor;
    }

    getSpeed(token) {
        const movement = token.actor.data.data.other.move;
        return movement;
    }

    getInitiative(token) {
        return
    }

    toggleInitiative(token) {
        return;
    }

    getPassivePerception(token) {
        return token.actor.data.data.skills.find.value;
    }

    getPassiveInvestigation(token) {
        return token.actor.data.data.skills.find.value;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'strength';
        return token.actor.data.data.attributes?.[ability];
    } 

    getAbilityModifier(token, ability) {
        return token.actor.data.data.attributes?.[ability].value;
    }

    getAbilitySave(token, ability) {
        if (ability == undefined) ability = 'dodge';
        let val = token.actor.data.data.skills?.[ability].value;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'reality';
        let val = token.actor.data.data.skills?.[ability].value;
        return (val >= 0) ? `+${val}` : val;
    }

    getProficiency(token) {
        return;
    }

    getConditionIcon(condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll') return window.CONFIG.controlIcons.effects;
        else return CONFIG.statusEffects.find(e => e.id === condition).icon;
    }

    getConditionActive(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        return token.actor.effects.find(e => e.isTemporary === condition) != undefined;
    }

    async toggleCondition(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll'){
            for( let effect of token.actor.effects)
                await effect.delete();
        }
        else {
            const effect = CONFIG.statusEffects.find(e => e.id === condition);
            await token.toggleEffect(effect);
        }
        return true;
    }

    /**
     * Roll
     */
     roll(token,roll,options,ability,skill,save) {
        if (roll == undefined) roll = 'ability';
        if (ability == undefined) ability = 'str';
        if (skill == undefined) skill = 'acr';
        if (save == undefined) save = 'str';

        if (roll == 'ability') token.actor.rollAbilityTest(ability,options);
        else if (roll == 'save') token.actor.rollAbilitySave(save,options);
        else if (roll == 'skill') token.actor.rollSkill(skill,options);
        else if (roll == 'initiative') token.actor.rollInitiative(options);
        else if (roll == 'deathSave') token.actor.rollDeathSave(options);
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') 
			return allItems.filter(i => 
            i.type == 'firearm' || 
            i.type == 'armor' || 
            i.type == 'implant'|| 
            i.type == 'gear'|| 
            i.type == 'meleeweapon'|| 
            i.type == 'eternityshard'|| 
            i.type == 'shield'|| 
            i.type == 'missileweapon'|| 
            i.type == 'heavywepon'|| 
            i.type == 'vehicle'|| 
            i.type == 'energyweapon')
		else if (itemType == 'weapon'){
			return allItems.filter(i => 
            i.type == 'firearm' ||
            i.type == 'meleeweapon'|| 
            i.type == 'missileweapon'|| 
            i.type == 'heavywepon'|| 
            i.type == 'energyweapon')
		}
        else return allItems.filter(i => i.type == itemType);
    }

    getItemUses(item) {
        return {available: item.data.data.quantity};
    }

    /**
     * Features
     */
    getFeatures(token,featureType) {
        if (featureType == undefined) featureType = 'any';
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => 
            i.type == 'perk' || 
            i.type == 'specialability'|| 
            i.type == 'specialability-rolltable' ||
            i.type == 'enhancement'|| 
            i.type == 'customAttack'|| 
            i.type == 'customSkill'
            )
        else return allItems.filter(i => i.type == featureType)
    }

    getFeatureUses(item) {
       return 0;
    }

    /**
     * Spells
     */
     getSpells(token,level) {
        const allItems = token.actor.items;
        return allItems.filter(i => i.type == 'spell' ||
            i.type == 'miracle'|| 
            i.type == 'psionicpower')
    }

    getSpellUses(token,level,item) {
        return;
    }

    rollItem(item) {
        if(item.data.type == 'firearm' ||
            item.data.type == 'meleeweapon'|| 
            item.data.type == 'missileweapon'|| 
            item.data.type == 'heavywepon'|| 
            item.data.type == 'energyweapon'){
                var test = this.createTestObject(item.actor, item)
                return torgchecks.weaponAttack(test);
            }
        else
            return item.roll()
    }

    createTestObject(actor, item)
    {
        var skill = actor.data.data.skills?.[item.data.data.attackWith];
        var attribute = actor.data.data.attributes?.[skill.baseAttribute];

        var test = {
            actor: actor.data._id,
            item: item.data,
            actorPic: actor.img,
            actorType: "stormknight",
            skillName: item.data.attackWith,
            skillBaseAttribute: skill.baseAttribute,
            skillAdds: skill.adds==null?0:skill.value - attribute,
            skillValue: skill.value,
            unskilledUse: skill.unskilledUse,
            strengthValue: actor.data.data.attributes.strength,
            charismaValue: actor.data.data.attributes.charisma,
            dexterityValue: actor.data.data.attributes.dexterity,
            mindValue: actor.data.data.attributes.mind,
            spiritValue: actor.data.data.attributes.spirit,
            testType: "attack",
            weaponName: item.name,
            weaponDamageType: item.data.data.damageType,
            weaponDamage: item.data.data.damage,
            possibilityTotal: 0,
            upTotal: 0,
            heroTotal: 0,
            dramaTotal: 0,
            cardsPlayed: 0,
            sizeModifier: 0,
            vulnerableModifier: 0
         };
         return test;
    }
}