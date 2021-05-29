/**
 * Copyright (C) 2020 Andrew Rioux
 *
 * This file is part of EvMPlus.org.
 *
 * EvMPlus.org is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * EvMPlus.org is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EvMPlus.org.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { InputProps } from './Input';
import { FormBlock, Label, MemberSelector, TextInput } from '../forms/SimpleForm';
import { Member } from 'common-lib';
import { NewTeamMemberEdit } from '../forms/usable-forms/TeamForm';

export interface TeamMemberInputProps extends InputProps<NewTeamMemberEdit> {
	memberList: Member[];
}

export const TeamMemberInput = (props: TeamMemberInputProps): JSX.Element => (
	<FormBlock
		onUpdate={props.onUpdate}
		onInitialize={props.onInitialize}
		value={props.value}
		name={`teamMemberInput-${props.index ?? 0}`}
	>
		<MemberSelector name="reference" memberList={props.memberList} />

		<Label>Job</Label>
		<TextInput name="job" />
	</FormBlock>
);

export default TeamMemberInput;
