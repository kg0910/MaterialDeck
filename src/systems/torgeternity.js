import {compatibleCore} from "../misc.js";

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
        return token.actor.data.data.skills.prc.passive;
    }

    getPassiveInvestigation(token) {
        return token.actor.data.data.skills.inv.passive;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'strength';
        return token.actor.data.data.attributes?.[ability];
    } 

    getAbilityModifier(token, ability) {
        return 0;
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
		 console.log(roll);
		 console.log(options);
		 console.log(ability);
		 console.log(skill);
		 console.log(save);
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
        if(item.data.itemType == 'firearm' ||
            item.data.itemType== 'meleeweapon'|| 
            item.data.itemType== 'missileweapon'|| 
            item.data.itemType== 'heavywepon'|| 
            item.data.itemType== 'energyweapon')
            return item.weaponAttack();
        else
            return item.roll()
    }
}