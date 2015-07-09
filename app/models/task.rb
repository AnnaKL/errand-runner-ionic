class Task < ActiveRecord::Base
  validates :title, :user_id, :description, :lon, :lat, presence: true

  belongs_to :user
end