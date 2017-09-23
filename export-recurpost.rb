require 'json'
file = File.read(ARGV[0])
posts = JSON.parse(file)
posts.each do |post|
  if post and post["category_name"] == ARGV[1]
    puts post["content_text"].tr("\n"," ").strip.gsub(/ *Link to:.*/,'').gsub(/  */,' ')
  end
end
