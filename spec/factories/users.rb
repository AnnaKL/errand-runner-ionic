FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password "12345678"
    password_confirmation "12345678"
    username { Faker::Internet.user_name }
    lat { Faker::Address.latitude }
    lon { Faker::Address.longitude }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end
end
