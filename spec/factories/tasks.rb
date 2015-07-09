FactoryGirl.define do
  factory :task do
    title { Faker::Lorem.word }
    description { Faker::Lorem.sentence }
    open true
    lat { Faker::Address.latitude }
    lon { Faker::Address.longitude }
    user
  end
end