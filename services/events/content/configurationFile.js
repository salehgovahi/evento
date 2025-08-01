const eventsConfiguration = [
    {
        section: 'signup',
        steps: [
            {
                name: '',
                parameters: {
                    name: 'required',
                    family: 'required'
                },
                index: 0
            }
        ],
        all_parameters: [
            'name',
            'family',
            'birth_date',
            'gender',
            'national_id',
            'province',
            'city',
            'educational_status',
            'employment_status',
            'job_title',
            'nationality',
            'passport_number',
            'educational_level',
            'field_of_study',
            'institution_name',
            'cv',
            'motivation_letter',
            'challenge'
        ]
    },
    {
        section: 'ticket',
        parameters: {
            needs_admin_confirm: 'false'
        }
    }
];

module.exports = eventsConfiguration;
