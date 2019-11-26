const mongoose = require('mongoose');


const CourseSchema = mongoose.Schema({
        type: {
                type: String,
                default: 'Achievement'
        },
        alignments: [{
                type: {
                        type: String,
                        default: 'AlignmentObject'
                },
                alignmentType: {
                        type: String,
                        default: 'educationalLevel'
                },
                educationalFramework: {
                        type: String,
                        default: 'US Grade Levels'
                },
                targetName: {
                        type: String,
                        default: '2'
                },
                targetUrl: {
                        id: {
                                type: String,
                                default: 'http://purl.org/ASN/scheme/ASNEducationLevel/2'
                        }
                }
        }],
        courseCode: String,
        prerequisites: String,
        creditsAvailable: Number,
        name: {
                type: String,
                required: [true, 'Why no School name?']
        },
        fieldOfStudy: String,
        issuer: {
                id: {
                        type: String,
                        index: true,
                        default: ''
                }
        },
        level: {
                type: {
                        type: {
                                type: String,
                                default: 'DefinedTerm'
                        },
                        name: {
                                type: String,
                                default: 'SCQF Level 7'
                        },
                        inDefinedTermSet: {
                                type: String,
                                default: 'https://www.sqa.org.uk/sqa/71377.html'
                        }
                }
        },
        requirement: {
                id: {
                        type: String,
                        default: ''
                },
                type: {
                        type: String,
                        default: ''
                },
                narrative: {
                        type: String,
                        default: ''
                },
                additionalProp1: {
                        type: Object,
                        default: {}
                }
        },
        resultDescriptions: [{
                id: {
                        type: String,
                        default: ''
                },
                type: {
                        type: String,
                        default: "GradePointAverage" | "LetterGrade" | "Percent" | "PerformanceLevel" | "PredictedScore" | "Result" | "RawScore" | "RubricScore" | "ScaledScore"
                },
                name: {
                        type: String
                },
                resultMin: {
                        type: String,
                        default: 'F'
                },
                resultMax: {
                        type: String,
                        default: 'A'
                }
        }],
        specialization: {
                type: String,
                default: 'Basic Technical Literacy'
        },
        tags: [{
                tech: {
                        type: String,
                        default: 'Intro'
                }
        }],
        studentDID: [{
                type: String,
                ref: 'Student'
        }],
        proof: {
                type: {
                        type: String,
                        default: 'ES256K'
                },
                created: {
                        type: Date,
                        default: new Date().toLocaleString()
                },
                proofPurpose: {
                        type: String,
                        default: 'assertionMethod'
                },
                verificationMethod: String,
                jws: String
        }
}, {
        timestamps: true

});


CourseSchema.pre("save", function (next) {
        const self = this;

        mongoose.models["Course"].findOne({ name: this.name }, function (err, results) {
                if (err) {
                        next(err);
                } else if (results) {
                        self.invalidate("course name", "course name must be unique");
                        next(new Error("course name must be unique"));
                } else {
                        next();
                }
        });
});

module.exports = mongoose.model('Course', CourseSchema);